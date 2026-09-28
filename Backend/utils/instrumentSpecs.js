//Pip size and contract size for each pair and index
const instrumentSpecs = {
    EURUSD:{
        pipSize: 0.0001,
        contractSize: 100000
    },
    GBPUSD: {
        pipSize: 0.0001,
        contractSize: 100000
    },

    USDJPY: {
        pipSize: 0.01,
        contractSize: 100000
    },

    GBPJPY: {
        pipSize: 0.01,
        contractSize: 100000
    },

    XAUUSD: {
        pipSize: 0.01,
        contractSize: 100
    },

    XAGUSD: {
        pipSize: 0.01,
        contractSize: 5000
    },
    BTCUSD: {
        pipSize: 0.1,
        contractSize: 1
    },

    ETHUSD: {
        pipSize: 0.1,
        contractSize: 1
    }
};

module.exports = instrumentSpecs