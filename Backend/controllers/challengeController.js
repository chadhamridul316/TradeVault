const challenge = require('../models/Challenge')
const trade = require('../models/Trade')
const mongoose = require('mongoose')
const CHALLENGE_RULES = require('../utils/helpers/constants')
const { calculateProfit, calculateBalance, calculateWinRate, calculateTotalTrades, calculateTotalLots, calculateAverageRR, calculateTradingDays } = require('../utils/calculations')
const { evaluateChallenge, updateChallengeStatus, setDailyStartingBalance } = require('../utils/services/challengeService')

//Get current challenge
const getCurrentChallenge =  async function(req,res){
    const {id} = req.params;
    try{
        const challenges = await challenge.findOne({
            _id: id,
            user_id: req.user._id
        })
        if(!challenges){
           return res.status(400).json({error:'No challenge found'})
        }

        // Ensure all stats and balance are synchronized with existing trades for the current step
        const allTrades = await trade.find({ challenge_id: challenges._id });
        const currentStepTrades = allTrades.filter(t => t.step === (challenges.currentStep || 1));

        const calculatedBalance = calculateBalance(challenges.accountSize, currentStepTrades);
        const calculatedTradingDays = calculateTradingDays(currentStepTrades);
        const calculatedTotalTrades = calculateTotalTrades(currentStepTrades);
        const calculatedTotalLots = calculateTotalLots(currentStepTrades);
        const calculatedWinRate = calculateWinRate(currentStepTrades);
        const calculatedAverageRR = calculateAverageRR(currentStepTrades);

        challenges.balance = calculatedBalance;
        challenges.equity = calculatedBalance;
        challenges.tradingDays = calculatedTradingDays;
        challenges.totalTrades = calculatedTotalTrades;
        challenges.totalLots = calculatedTotalLots;
        challenges.winRate = calculatedWinRate;
        challenges.averageRR = calculatedAverageRR;

        // Synchronize daily starting balance and rule evaluations
        setDailyStartingBalance(challenges, currentStepTrades);
        if (challenges.status !== 'Not-Started') {
            const ruleResults = evaluateChallenge(challenges, currentStepTrades);
            updateChallengeStatus(challenges, ruleResults);
        }

        await challenges.save();

        res.status(200).json(challenges)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

//Create new challenge
const createChallenge = async function(req,res){
    const {accountSize} = req.body//i can't set it manually as it will be set as per the user preference
    try{
        //check if a challenge already exists for this user
        const existingChallenge = await challenge.findOne({
            user_id: req.user._id,
            status:{$in:['Not-Started','Active']}
        })
        //if challenge already exists give error
        if(existingChallenge){
            return res.status(400).json({error:'Finish the current challenge before creating a new one'})
        }
        //if no challenge exists, create a new one
        const challenges = new challenge({
            user_id: req.user._id,
            accountSize,
            //Rules
            ...CHALLENGE_RULES,//with the help of spread operator i can use all the content with just 3 dots
            balance:accountSize,
            equity:accountSize,
            status:'Not-Started',
            currentStep:1,
            tradingDays:0
        })
        const savedChallenge= await challenges.save();
        res.status(200).json(savedChallenge)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

//Start Challenge
const startChallenge = async function(req,res){
    const {id} = req.params

    //check if the id is valid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:'Invalid Challenge id'})
    }
    try{
        //Find the Challenge
        const challenges = await challenge.findOne({
            _id: id,
            user_id: req.user._id
        });
        //if challenge with certain id is not found
        if(!challenges){
            return res.status(400).json({error:'Challenge not found'})
        }
        //Don't start an already active challenge
        if(challenges.status!="Not-Started"){//we can only start a challenge if status is not-started. if status is pass,fail,inactive we can't start challenge
            return res.status(400).json({error:'Challenge cannot be started'})
        }
        //if challenge status is not-started and id is valid, start the challenge
        challenges.status="Active"//make the status active
        challenges.startDate = new Date()//fix the date to current date

        const saveChallenge = await challenges.save();
        res.status(200).json(saveChallenge)
    }
    catch(error){
        res.status(400).json({
            error:error.message
        });
    }
}

//Get all challenges for logged in user
const getUserChallenges = async function(req,res){
    try{
        const challenges = await challenge.find({
            user_id: req.user._id
        }).sort({createdAt:-1})

        // Synchronize all stats and balance for challenges for their current step
        for (const ch of challenges) {
            const allTrades = await trade.find({ challenge_id: ch._id });
            const currentStepTrades = allTrades.filter(t => t.step === (ch.currentStep || 1));
            
            ch.balance = calculateBalance(ch.accountSize, currentStepTrades);
            ch.equity = ch.balance;
            ch.tradingDays = calculateTradingDays(currentStepTrades);
            ch.totalTrades = calculateTotalTrades(currentStepTrades);
            ch.totalLots = calculateTotalLots(currentStepTrades);
            ch.winRate = calculateWinRate(currentStepTrades);
            ch.averageRR = calculateAverageRR(currentStepTrades);

            // Synchronize daily starting balance and rule evaluations
            setDailyStartingBalance(ch, currentStepTrades);
            if (ch.status !== 'Not-Started') {
                const ruleResults = evaluateChallenge(ch, currentStepTrades);
                updateChallengeStatus(ch, ruleResults);
            }

            await ch.save();
        }

        res.status(200).json(challenges)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

module.exports = {getCurrentChallenge,createChallenge,startChallenge,getUserChallenges}