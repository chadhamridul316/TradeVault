//Everytime this file function is called it will check whether the current rules of the account are breached or not
const {checkProfitTarget,checkMaxDrawdown,checkDailyDrawdown,checkMinTradingDays,checkInactivity} = require('../challengeRules')

//check for dailyStartingBalance for the current step
const setDailyStartingBalance = (challenge, trades = [])=>{
    const today = new Date();
    // Prior days trades in the current step
    const priorDaysTrades = (trades || []).filter(t => {
        const tradeDate = new Date(t.tradeDate || t.createdAt);
        return tradeDate.toDateString() !== today.toDateString() && tradeDate < today;
    });

    const calculatedDayStart = challenge.accountSize + priorDaysTrades.reduce((sum, t) => sum + (t.result || 0), 0);

    challenge.dailyStartingBalance = calculatedDayStart;
    challenge.dailyStartDate = today;
    return challenge.dailyStartingBalance;
};

const evaluateChallenge = (challenge,trades)=>{
    const profitTargetReached = checkProfitTarget(challenge);

    const maxDrawdownBreached = checkMaxDrawdown(challenge);

    const dailyStartingBalance = setDailyStartingBalance(challenge, trades);

    const dailyDrawdownBreached = checkDailyDrawdown(challenge, dailyStartingBalance);

    const minTradingDaysReached = checkMinTradingDays(trades, challenge.minimumTradingDays || 3);

    const inactivityBreached = checkInactivity(challenge,trades);
    
    //i need to return the result of these functions, so that whenever evaluateChallenge is called we get these results
    return{
        profitTargetReached,
        maxDrawdownBreached,
        dailyDrawdownBreached,
        minTradingDaysReached,
        inactivityBreached
    }
}

//function to update the account status
const updateChallengeStatus = (challenge,ruleResults)=>{
        if(ruleResults.dailyDrawdownBreached || ruleResults.maxDrawdownBreached){
            challenge.status = "Failed";
        }
        else if(ruleResults.inactivityBreached){
            challenge.status = "Inactive";
        }
        //if step 1 is completed and the user moves to step 2
        else if(ruleResults.profitTargetReached && ruleResults.minTradingDaysReached && challenge.currentStep === 1){
            //Reset the analytics for the account as per the step
            challenge.stepStartingBalance = challenge.accountSize;

            challenge.balance = challenge.accountSize;
            challenge.equity = challenge.accountSize;

            challenge.winRate = 0;
            challenge.totalTrades = 0;
            challenge.totalLots = 0;
            challenge.averageRR = 0;
            challenge.tradingDays = 0;

            challenge.dailyStartingBalance = challenge.balance;
            challenge.dailyStartDate = new Date();

            challenge.currentStep = 2;//update the currentStep to 2 for next challenge
            challenge.status = "Active";
        }
        else if(ruleResults.profitTargetReached && ruleResults.minTradingDaysReached && challenge.currentStep === 2){
            challenge.status = "Passed";
        }
        else{
            challenge.status = "Active";//as none of the rule is breached and challenge is going on
        }
}
module.exports = {evaluateChallenge,setDailyStartingBalance,updateChallengeStatus};