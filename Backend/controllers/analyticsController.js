//This file contains all the Statistics related to an account which will be shown under analytics page
const trade = require('../models/Trade')
const challenge = require('../models/Challenge')
const {calculateProfit , calculateBalance, calculateWinRate , calculateTotalTrades , calculateTotalLots , calculateAverageRR, calculateTradingDays} = 
require('../utils/calculations')

const getAnalytics = async function(req,res){
    try{
        const {challenge_id} = req.params//grab the challenge id entered by the user

        //find challenge
        const challenges = await challenge.findById(challenge_id)
        
        //check if challenge exists or not
        if(!challenges){
            return res.status(400).json({error:'Challenge Not Found'})
        }

        //fetch all the trades from the challenge_id entered by the user
        const allTrades = await trade.find({challenge_id:challenge_id});

        // Filter trades for the current challenge step
        const currentStepTrades = allTrades.filter(
            t => t.step === (challenges.currentStep || 1)
        );

        //Calculate Analytics for current step
        const totalTrades = calculateTotalTrades(currentStepTrades);

        const totalLots = calculateTotalLots(currentStepTrades);

        const winRate = calculateWinRate(currentStepTrades);

        const averageRR = calculateAverageRR(currentStepTrades);

        const tradingDays = calculateTradingDays(currentStepTrades);

        const balance = calculateBalance(challenges.accountSize, currentStepTrades);

        const equity = balance;

        res.status(200).json({totalTrades,totalLots,winRate,averageRR,tradingDays,balance,equity});
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

module.exports = {getAnalytics}