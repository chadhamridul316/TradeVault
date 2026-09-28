const { Timestamp } = require('bson')
const mongoose = require('mongoose')
//CONTAINS DATA OF THE ACCOUNT PROGRESS
const challengeSchema = new mongoose.Schema({
    accountSize:{
        type:Number,
        required:true
    },
    //RULES
    profitTarget:{
        type:Number,
        default:8
    },
    dailyDrawdown:{
        type:Number,
        default:5
    },
    maxDrawdown:{
        type:Number,
        default:10
    },
    minimumTradingDays:{
        type:Number,
        default:3
    },
    inactivityLimit:{
        type:Number,
        default:15
    },
    //Progess
    balance:{
        type:Number
    },
    equity:{
        type:Number
    },
    winRate:{
        type:Number
    },
    totalTrades:{
        type:Number
    },
    totalLots:{
        type:Number
    },
    averageRR:{
        type:Number
    },
    tradingDays:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:['Not-Started','Active','Inactive','Passed','Failed'],
        default:'Not-Started'
    },
    currentStep:{
        type:Number,
        enum:[1,2],
        default:1
    },
    startDate:{
        type:Date
    },
    dailyStartingBalance:{
        type:Number,
        default:null
    },
    dailyStartDate:{//We need to know whether the stored dailyStartingBalance belongs to today.
        type:Date,
        default:null
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stepStartingBalance:{//we need to set the starting balance of each step
        type:Number,
        default:null
    }
},{timestamps:true})

module.exports =  mongoose.model('challenge',challengeSchema)