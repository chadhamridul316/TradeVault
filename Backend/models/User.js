const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    }
})

//Signup method
userSchema.statics.signup = async function(email,password){
    //check if email and password field are not empty
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    //check if email is valid
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }

    //check if password is strong
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }

    //check if email already exists or not
    const exists = await this.findOne({email})
    if(exists){
        throw Error('Email already in use')
    }

    //generating salt to make the password stronger
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);//adding salt to the password

    //create a new user
    const user = await this.create({email,password:hash})
    return user
}

//login method
userSchema.statics.login = async function(email,password){
    //check if email and password field are not empty
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    //check if email exists or not
    const user = await this.findOne({email})

    if(!user){
        throw Error('Incorrect email')
    }

    //match the user password with the hashed password
    const match = await bcrypt.compare(password,user.password)
    if(!match){
        throw Error('Incorrect password')
    }
    return user
}

module.exports = mongoose.model('User',userSchema)