//This file checks whether a challenge should pass or fail based on specific rules
const trade = require('../models/Trade')
const challenge = require('../models/Challenge')
const mongoose = require('mongoose')

//Show the profit target based on the current step
const getProfitTarget = (challenge)=>{
    if(challenge.currentStep === 1){
        return 8;
    }
    if(challenge.currentStep === 2){
        return 6;
    }
}

//check if the profit target is achieved or not
const checkProfitTarget = (challenge)=>{
    const result = ((challenge.balance - challenge.accountSize)/challenge.accountSize)*100;

    const target = getProfitTarget(challenge)//get the target required for each step
    return result >= target;
};

//check if the max Drawdown limit reached or not
const checkMaxDrawdown = (challenge)=>{
    const result = ((challenge.balance - challenge.accountSize)/challenge.accountSize)*100

    return result <= -challenge.maxDrawdown;//no need to write -10 as i have already specified default value as 10 for maxDrawdown in challenge model
}

//check Daily Drawdown
const checkDailyDrawdown = (challenge,dailyStartingBalance)=>{//i want the dailyStartingBalance to calculate the loss of that day
    //and not the account starting balance
    const result = ((challenge.balance - dailyStartingBalance)/dailyStartingBalance)*100

    return result <= -challenge.dailyDrawdown;
}

//check Minimum trading days meaning user should have placed a trade on atleast required different days, then only account consider passed
const checkMinTradingDays = (trades, minTradingDays = 3)=>{
    if (!trades || trades.length === 0) {
        return false;
    }
    //declare the variable tradingDays as a set to store unique dates only
    const tradingDays = new Set();
    
    //now iterate through each trade and grab only the date from the format -> "2026-08-10T10:30:00"
    for(const trade of trades){
        const dateVal = trade.tradeDate || trade.createdAt;
        if(dateVal){
            const date = new Date(dateVal)
            .toISOString()//converts the date into this format 2026-08-10T10:30:00.000Z
            .split("T")[0];//now split at T and grab the 0th index i.e. 2026-08-10

            //add the date to the set
            tradingDays.add(date);
        }
    }
    return tradingDays.size >= minTradingDays;
}

//check Inactivity limit
const checkInactivity = (challenge,trades)=>{//challenge if no trades exist, trades to fetch the last trade date

    let lastActivityDate;
    // If trades exist, use the date of the latest trade
    if (trades.length > 0) {
        lastActivityDate = new Date(//convert every trade into number, find the biggest/latest one and convert it back to date
            Math.max(
                ...trades.map(trade => new Date(trade.tradeDate).getTime())
            )
        );
    } 
    //if no trades exist, use the date when challenge got created
    else{
        //date when account was created
        lastActivityDate = new Date(challenge.startDate);
    }
        //today's date
        const today = new Date();
        //difference between today's date and account created date
        const difference = today - lastActivityDate;

        // difference gives value in milliseconds so change into days
        const daysSinceLastActivity = difference / (1000 * 60 * 60 * 24)

        return daysSinceLastActivity >= challenge.inactivityLimit;
}

module.exports = {getProfitTarget,checkProfitTarget,checkMaxDrawdown,checkDailyDrawdown,checkMinTradingDays,checkInactivity}