const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createUserToken, requireToken } = require('../middleware/auth')
const passport = require('passport')

router.post('/login', (req, res)=>{
    User.findOne({email: req.body.email})
    .then(foundUser => createUserToken(req, foundUser))
    .then(token => res.json({token}))
    .catch(err => console.log('ERROR LOGGING IN', err))
})

router.post('/signup', (req, res)=>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => ({
        email: req.body.email,
        password: hash,
        motto: req.body.motto
    }))
    .then(hashedUser => User.create(hashedUser))
    .then(createdUser => createUserToken(req, createdUser))
    .then(token => res.status(201).json({token}))
    .catch(err => console.log('ERROR CREATING USER', err))
})

//PRIVATE
//GET /api/private
router.get('/private', requireToken, (req, res) => {
    return res.json({message: 'Thou shall pass'})
})

module.exports = router