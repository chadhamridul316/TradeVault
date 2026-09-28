const express = require('express')
const {getAnalytics} = require('../controllers/analyticsController')
const router = express.Router();

//why challenge_id ? as i want the analytics of a challenge_id so i will write the account id
router.get('/:challenge_id',getAnalytics);

module.exports = router