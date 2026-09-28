const trade = require('../models/Trade')
const challenge = require('../models/Challenge')
const mongoose = require('mongoose')
const {calculateProfit , calculateBalance, calculateWinRate , calculateTotalTrades , calculateTotalLots , calculateAverageRR, calculateTradingDays} = require('../utils/calculations')
const {evaluateChallenge,setDailyStartingBalance,updateChallengeStatus} = require('../utils/services/challengeService')

//Get single trade
const getSingleTrade = async function(req,res){
    try{
        //check if trades exist or the id entered is correct or not
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({error:'Invalid trade ID'});
        }
        const trades = await trade.findById(req.params.id);

        if(!trades){
            return res.status(404).json({
                error: "Trade Not Found"
            });
        }
        res.status(200).json(trades);
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}
//Get all trades from a particular challenge
const getTradesByChallenge = async function(req,res){
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.challenge_id)){
            return res.status(400).json({error:'Invalid challenge ID'});
        }

        const challenges = await challenge.findOne({
            _id: req.params.challenge_id,
            user_id: req.user._id
        });

        if (!challenges) {
            return res.status(404).json({
                error: 'Challenge not found'
            });
        }

        //Find all trades belonging to a challenge
        const trades = await trade.find({challenge_id: req.params.challenge_id});

        if(!trades){
            return res.status(404).json({
                error: "Trade Not Found"
            });
        }
        res.status(200).json(trades);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
} 

//Get all Trades
const getTrades = async function(req,res){
    try{
        const trades = await trade.find().sort({createdAt:-1});
        res.status(200).json(trades);
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

//Create Trade
const createTrade = async function(req,res){
    try{
        //Get the challenge to update the balance and equity of account
        const challenges = await challenge.findOne({
            _id: req.body.challenge_id,
            user_id: req.user._id
        });

        if(!challenges){
            return res.status(400).json({error:'Challenge Not Found'})
        }

        //disallow the users to place a trade if the account status is failed,inactive or passed
        if(challenges.status === "Inactive" || challenges.status === "Failed" || challenges.status === "Passed"){
            return res.status(400).json({
                error:`Cannot place a trade. Challenge is ${challenges.status}`
            });
        }

        //call the calculateProfit function with these parameters entered by the user and store it in result
        const result = calculateProfit(
            req.body.pair,
            req.body.tradeType,
            req.body.entryPrice,
            req.body.exitPrice,
            req.body.lotSize
        )

        //set dailyStartingBalance
        setDailyStartingBalance(challenges);

        //create Trade
        const trades = new trade({
            challenge_id:req.body.challenge_id,
            pair:req.body.pair,
            tradeType:req.body.tradeType,
            entryPrice:req.body.entryPrice,
            takeProfit:req.body.takeProfit,
            stopLoss:req.body.stopLoss,
            exitPrice:req.body.exitPrice,
            lotSize:req.body.lotSize,
            result,//result get's calculated and get's added to the information
            step: challenges.currentStep//will take it automatically from challenge step so the user don't have to add it manually
        })

        const savedTrade = await trades.save();

        // Give me every trade belonging to this challenge or account
        const allTrades = await trade.find({
            challenge_id:req.body.challenge_id
        })
        //filtering the trades based on the current step of the challenge
        const currentStepTrades = allTrades.filter(
            trade => trade.step === challenges.currentStep
        );
        //Now call each function and update them as per the entered trades
        const totalTrades = calculateTotalTrades(currentStepTrades);//passing alltrades as a parameter as totalTrades will be calculated based on all trades

        const totalLots = calculateTotalLots(currentStepTrades);

        const averageRR = calculateAverageRR(currentStepTrades);

        const winRate = calculateWinRate(currentStepTrades);

        const tradingDays = calculateTradingDays(currentStepTrades);
        
        //calculate new balance for all the trades
        const balance = calculateBalance(challenges.accountSize,currentStepTrades);

        const equity = balance;
        
        //Update the challenge balance and equity after the trade has been added
        challenges.balance = balance;
        challenges.equity = equity;
        challenges.totalTrades = totalTrades;
        challenges.totalLots = totalLots;
        challenges.averageRR = averageRR;
        challenges.winRate = winRate;
        challenges.tradingDays = tradingDays;
        
        //Update the status of the challenge after we create the first trade
        if(challenges.status==="Not-Started"){
            challenges.status = "Active";
        }
        
        //call the function in challengeServices to check if any rule got breached
        const ruleResults = evaluateChallenge(challenges,currentStepTrades)

        //update the status of the challenge based on the ruleResults
        updateChallengeStatus(challenges,ruleResults);

        await challenges.save();

        res.status(200).json({
            trade:savedTrade,//save the trade
            analytics:{//analytics contains all the calculated stats.. call all the updated function
                totalTrades: challenges.totalTrades,
                totalLots: challenges.totalLots,
                averageRR: challenges.averageRR,
                winRate: challenges.winRate,
                tradingDays: challenges.tradingDays,
                balance: challenges.balance,
                equity: challenges.equity
            },
            challenge:challenges//sends the updated Challenge document back.
        })
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

//Delete Trade
const deleteTrade = async function(req,res){
    try{
        const {id} = req.params;//req the trade id from the user to delete it
        //check if the id is valid
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error:'Invalid Trade ID'})
        }
        const deletetrade = await trade.findById(id)//search the trade which user wants delete with the id
        if(!deletetrade){
            return res.status(400).json({error:'Invalid ID'})
        }
        //the trade which i need to delete contains the challenge_id but if i delete the trade first i can't fetch the challengeid
        //so i need to fetch the challenge_id first from the trade that needs to be deleted and then delete it
        const challengeId = deletetrade.challenge_id;

        //find the challenge in respect to the trade id
        const challenges = await challenge.findOne({
            _id: challengeId,
            user_id: req.user._id
        });

        if (!challenges) {
            return res.status(404).json({
                error: "Challenge Not Found"
            });
        }

        //preventing the user to delete trade if he has moved from step 1 to step 2
        if(challenges.currentStep === 2 && deletetrade.step === 1){
            return res.status(400).json({
                error:"Trades from step 1 cannot be deleted after moving to step 2"
            });
        }

        //delete the trade
        await trade.findByIdAndDelete(id);

        //Fetch all the trades from the challenge to calculate balance and equity
        const allTrades = await trade.find({challenge_id:challengeId}) 

        const currentStepTrades = allTrades.filter(
            trade => trade.step === challenges.currentStep
        );

        //Recalculate analytics, as we deleted a trade
        const totalTrades = calculateTotalTrades(currentStepTrades);

        const totalLots = calculateTotalLots(currentStepTrades);

        const averageRR = calculateAverageRR(currentStepTrades);

        const winRate = calculateWinRate(currentStepTrades);

        const tradingDays = calculateTradingDays(currentStepTrades);

        const balance = calculateBalance(challenges.accountSize,currentStepTrades);

        const equity = balance;
        //update challenge
        challenges.balance = balance;
        challenges.equity = equity;
        challenges.totalTrades = totalTrades;
        challenges.totalLots = totalLots;
        challenges.averageRR = averageRR;
        challenges.winRate = winRate;
        challenges.tradingDays = tradingDays;

        //call the function in challengeServices to check if any rule got breached
        const ruleResults = evaluateChallenge(challenges,currentStepTrades)

        //update the status of the challenge based on the ruleResults
        updateChallengeStatus(challenges,ruleResults);

        await challenges.save();//save the new data in challenge

        res.status(200).json({
            message:"Trade Deleted Successfully",
            trade:deletetrade,
            challenge:challenges
        });
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
};

module.exports = {getSingleTrade,getTrades,createTrade,deleteTrade,getTradesByChallenge}