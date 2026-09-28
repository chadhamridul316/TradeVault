//File to create a journal of trades based on the tradeDate and result of the trade
const createJournal = (trades) => {//fetch all the trades 

    const journal = {};

    for (const trade of trades) {

        const date = new Date(trade.tradeDate)//grab the date on which the trade was placed
            .toISOString()
            .split("T")[0];//extract the date part from the tradeDate

        // If this date doesn't exist yet,create a new entry in the journal
        if (!journal[date]) {
            journal[date] = {//intitally the trade count and profit will be 0 and trades will be an empty array
                totalTrades: 0,
                totalProfit: 0,
                trades: []
            };
        }

        // Increase number of trades
        journal[date].totalTrades++;

        // Add profit/loss i.e. result of the trade added to totalProfit for that date
        journal[date].totalProfit += trade.result;

        // Add trade details
        journal[date].trades.push(trade);
    }

    return journal;
};

module.exports = { createJournal };