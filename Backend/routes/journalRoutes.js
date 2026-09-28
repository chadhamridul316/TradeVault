const express = require('express');
const {getJournal} = require('../controllers/journalController')
const {requireAuth} = require('../middleware/requireAuth')
const router = express.Router();

//get journal for a particular challenge
router.get('/:challenge_id',requireAuth,getJournal);

module.exports = router;