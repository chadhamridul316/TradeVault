const express = require('express')
const {getSingleTrade,getTrades,createTrade,deleteTrade,getTradesByChallenge} = require('../controllers/tradeController')
const {requireAuth} = require('../middleware/requireAuth')
const router = express.Router()

//get trades from a particular challenge
router.get('/:challenge_id',requireAuth,getTradesByChallenge)

//get single trade 
router.get('/:id',requireAuth,getSingleTrade)

//get all trades
router.get('/',requireAuth,getTrades)

//create a trade
router.post('/',requireAuth,createTrade)

//delete a trade
router.delete('/:id',requireAuth,deleteTrade)

module.exports = router