const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.post('/login', (req, res)=>{
    res.send('hit the login post route')
})

router.post('/signup', (req, res)=>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => ({
        email: req.body.email,
        password: hash,
        motto: req.body.motto
    }))
    .then(hashedUser => User.create(hashedUser))
    .then(createdUser => res.json(createdUser))
    .catch(err => console.log('ERROR CREATING USER', err))
})

module.exports = router