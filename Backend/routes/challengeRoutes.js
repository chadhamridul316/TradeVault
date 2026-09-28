const express = require('express')
const {getCurrentChallenge,createChallenge,startChallenge,getUserChallenges} = require('../controllers/challengeController')
const {requireAuth} = require('../middleware/requireAuth')
const router = express.Router()

//get all challenges for user
router.get('/',requireAuth,getUserChallenges)

//get current challenge
router.get('/:id',requireAuth,getCurrentChallenge)

//Create Challenge
router.post('/',requireAuth,createChallenge)

// Start challenge
router.patch('/:id/start',requireAuth,startChallenge);

module.exports = router