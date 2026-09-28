//ALL THE CALCULATIONS RELATED TO CHALLENGE WILL BE DONE IN THIS FILE
const instrumentSpecs = require('./instrumentSpecs')

//we have imported trade in tradeController file and we will call calculation functions in tradeController so we can use tradeType,
//entryPrice,exitPrice from there
//Get the profit
const calculateProfit = (pair,tradeType,entryPrice,exitPrice,lotSize)=>{
    const instrument = instrumentSpecs[pair];//suppose pair value is gold so we can access pipsize and contract of gold
    //if the entered pair value is not listed
    if(!instrument){
        throw new Error("Unsupported trading pair")
    }

    //calculate profit
    let priceDifference;
    if(tradeType==="BUY"){
        priceDifference =  exitPrice - entryPrice;//4100-4000 = 100
    }
    else{//trade type === sell
        priceDifference = entryPrice - exitPrice;//4000-3900 = 100
    }

    const profit = priceDifference * instrument.contractSize * lotSize;

    //toFixed return string value, so we will use Number to convert it into Number
    return Number(profit.toFixed(2));
}

//Calculate balance
const calculateBalance = (startingBalance,trades)=>{
    let balance = startingBalance;//let initial balance be my balance
    for(const trade of trades){//iterate through each trade
        balance+=trade.result;//and add it's result in balance
    }
        return Number(balance.toFixed(2));
}

//No need to calculate equity for now as the the balance changes after a trade closes so balance==equity for now

//Calculate Winrate
const calculateWinRate = (trades)=>{
    if(trades.length===0){
        return 0;
    }
    let win = 0;
    for(const trade of trades){
        if(trade.result>0){//if the result of the trade is positive
            win++;
        }
    }
    return Number(((win/trades.length) *100).toFixed(2));
}

//Total No of trades
const calculateTotalTrades = (trades)=>{
    return trades.length;
}

//calculate Total lots
const calculateTotalLots = (trades)=>{
    let totalLots = 0;

    //iterate for each trade from trades to get their lotSize
    for(const trade of trades){
        totalLots+=trade.lotSize
    }
    return Number(totalLots.toFixed(2));
}
//Calculate Average RR
const calculateAverageRR = (trades)=>{
    //if no fo trades are 0 return 0
    if(trades.length===0){
        return 0;
    }
    let totalRR = 0
    //iterate for each trade
    for(const trade of trades){
        const risk = Math.abs(trade.entryPrice - trade.stopLoss);
        const reward = Math.abs(trade.takeProfit - trade.entryPrice);

        //rr per trade
        if(risk!==0){
            totalRR+=reward/risk
        }
    }

    //RR from all the trades
    return Number((totalRR/trades.length).toFixed(2));
}

// Calculate Trading Days (unique calendar days where trades were placed)
const calculateTradingDays = (trades) => {
    if (!trades || trades.length === 0) {
        return 0;
    }
    const tradingDays = new Set();
    for (const trade of trades) {
        const dateVal = trade.tradeDate || trade.createdAt;
        if (dateVal) {
            const date = new Date(dateVal).toISOString().split("T")[0];
            tradingDays.add(date);
        }
    }
    return tradingDays.size;
}

module.exports = {calculateProfit , calculateBalance, calculateWinRate , calculateTotalTrades , calculateTotalLots , calculateAverageRR, calculateTradingDays}