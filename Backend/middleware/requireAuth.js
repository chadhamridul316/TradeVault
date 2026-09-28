//This file will take the JWT token I generated during login/signup, verify it, and identify the logged-in user.
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const requireAuth = async(req,res,next)=>{
    
    const {authorization} = req.headers//authorization is the header which contains the token
    if(!authorization){
        return res.status(401).json({error:"Authorization token required"})
    }
    //authorization string is - "bearer token" and we want token so split on space and give me index 1 value i.e. token
    const token = authorization.split(' ')[1]
    try{
        const {_id} = jwt.verify(token,process.env.SECRET)

        //find the user from the database
        req.user = await User.findOne({ _id }).select('_id'); //find the user on the basis of _id 
        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }

        next();
    }
    catch(error){
        console.error(error);
        res.status(401).json({error:'Request is not Authorized'})
    }
}

module.exports = {requireAuth}