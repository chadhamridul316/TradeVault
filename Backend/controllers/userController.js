//Flow of this file
/*Request
   ↓
Get email + password from req.body
   ↓
Call User.login() or User.signup()
   ↓
Create JWT token
   ↓
Send response to frontend */

const User = require('../models/User')
const jwt = require('jsonwebtoken')

const createToken = (_id)=>{
    //syntax = jwt.sign(Payload,Secret,Options)
    return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'})//user will logout after 3 days
}

//Login user
const loginUser = async (req,res)=>{
    const {email,password} = req.body

    try{
        //call the custom login function
        const user = await User.login(email,password);

        //create token of the user id
        const token = createToken(user._id)
        res.status(200).json({email:user.email,token})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

//Signup user
const signupUser = async (req,res)=>{
    const {email,password} = req.body

    try{
        //call the custom signup function
        const user = await User.signup(email,password);

        //create token of the user id
        const token = createToken(user._id)
        res.status(200).json({email:user.email,token})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

module.exports = {loginUser,signupUser}