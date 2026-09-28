const trade = require('../models/Trade');
const mongoose = require('mongoose');
const {createJournal} = require('../utils/Journal');

const getJournal = async function(req,res){
    try{
        const {challenge_id} = req.params;
        
        //check the validity of challenge id
        if(!mongoose.Types.ObjectId.isValid(challenge_id)){
            return res.status(400).json({
                error:"Invalid Challenge ID"
            })
        }

        //get all trades with this id
        const trades = await trade.find({challenge_id:challenge_id}).sort({tradeDate : 1});//tradeDate is sorted in ascending order 

        //create journal
        const journal = createJournal(trades);//sending all the trades as argument
        res.status(200).json(journal);
    }
    catch(error){
        res.status(400).json({error: error.message})
    };
}

module.exports = {getJournal};