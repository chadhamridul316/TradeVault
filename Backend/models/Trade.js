const mongoose = require('mongoose')

//CONTAINS DATA FOR EACH TRADE
const tradeSchema = new mongoose.Schema({
    challenge_id:{//we need this as if user passes 1 account and starts another so new trades don't get add to old account
        type: mongoose.Schema.Types.ObjectId,//it gives the new account id
        ref: 'challenge',//ObjectId refers to the Challenge model
        required: true
    },
    pair:{
        type:String,
        enum: [
            "EURUSD",
            "GBPUSD",
            "USDJPY",
            "GBPJPY",
            "XAUUSD",
            "XAGUSD",
            "BTCUSD",
            "ETHUSD"
        ],
        required:true
    },
    tradeType:{
        type:String,
        enum:['BUY','SELL'],
        required:true
    },
    entryPrice:{
        type:Number,
        required:true
    },
    takeProfit:{
        type:Number,
        required:true
    },
    stopLoss:{
        type:Number,
        required:true
    },
    exitPrice:{
        type:Number,
        required:true
    },
    lotSize:{
        type:Number,
        required:true
    },
    tradeDate:{
        type:Date,
        default:Date.now
    },
    result: {//instead of calculating balance everytime, i would store it in result
    type: Number,
    required: true
    },
    step:{
        type:Number,
        required:true
    }

},{timestamps:true})

module.exports = mongoose.model('trade',tradeSchema);
