require('dotenv').config()//method to import the env file

const express = require('express') 
const mongoose = require('mongoose')
const cors = require('cors')//used for making req between 2 servers or ports like making req from backend to frontend
const challengeRoutes = require('./routes/challengeRoutes')
const tradeRoutes = require('./routes/tradeRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const journalRoutes = require('./routes/journalRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
app.use(cors());

//Middleware
app.use(express.json());//change data into json format which can be readed by express
app.use((req,res,next)=>{//request and response
    console.log(req.path,req.method)//req.path gives you the req like /trade and req.method tells you the method like get, post
    next()//when one req is executed, next function is called and the process goes to next req
})

//Routes
app.use('/challenges',challengeRoutes)
app.use('/trades',tradeRoutes)
app.use('/analytics',analyticsRoutes)
app.use('/journal',journalRoutes)
app.use('/user',userRoutes)

//Connect to db
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('Connected to databse and listening on port',process.env.PORT)
    })
})
.catch((err)=>{
    console.log(err)
})