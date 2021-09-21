const express = require('express')
const router = express.Router()
const passport = require('passport')

// Authentication done with google
//@route GET /auth/google
router.get('/google',
    passport.authenticate('google', {scope: ['profile']}))

// Google Authentication Callback
//@route GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        res.redirect('/dashboard')
    })
module.exports = router
