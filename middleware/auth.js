require('dotenv').config()
const passport = require('passport')
const Strategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const options = {
    secretOrKey: process.env.JWT_SECRET,
    // How passport should find and extract the token from the request
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const findUser = (jwt_payload, done) => {
    User.findById(jwt_payload.id)
    .then(foundUser => done(null, foundUser))
    .catch(err => done(err))
}

// construct the strategy
const strategy = new Strategy(options, findUser)

// 'Register' the strategy so that passport uses it 
// when we call the passport.authenticate() method
passport.use(strategy)

// Initialize the passport middleware based on the above configuration
passport.initialize()

// we will export this and use it in the login route to create a token each time a user logs in (or signs up)
const createUserToken = (req, user) => {
    // first we check the password using bcrypt
    const validPassword = req.body.password ?
        bcrypt.compareSync(req.body.password, user.password) : false
    // const validPassword
    // if(req.body.password) {
    //     validPassword = bcrypt.compareSync(req.body.password, user.password)
    // } else {
    //     validPassword = false
    // }
    if(!user || !validPassword) { // if there was an issue with email/password
        const err = new Error('The provided email OR password is incorrect')
        err.statusCode = 422
        throw err
    } else { // if the user and their password is leget
        const payload = {
            id: user._id,
            email: user.email,
            motto: user.motto
        }
        return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 3600})
    }
}

const requireToken = passport.authenticate('jwt', {session: false})

module.exports = { createUserToken, requireToken }