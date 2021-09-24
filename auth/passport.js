
// The Google authentication strategy authenticates users using a Google account and OAuth 2.0 tokens.
const GoogleAuth20 = require('passport-google-oauth20')
const mongoose = require('mongoose')
const GoogleUser = require('../dbModels/googleUser')

module.exports = function (passport) {

    /*
    When creating a strategy, the client ID and secret are input as options. For this strategy, a verify callback is required,
    as well as a profile containing the authenticated user's Google account and an access token and optional refresh token.
    o complete authentication, the verify callback must make a call to cb with a user.
     */
    passport.use(new GoogleAuth20({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
            }

            try{
                let user = await GoogleUser.findOne({googleId: profile.id})

                if (user){
                    done(null, user)
                }else {
                    user = await GoogleUser.create(newUser)
                    done(null,user)
                }
            }catch (err){
                console.error(err)
            }
        }))

    passport.serializeUser(function (googleUser, done) {
        done(null, googleUser.id)
    })

    passport.deserializeUser(function (id, done) {
        GoogleUser.findById(id, function (error, googleUser) {
            done(error, googleUser)
        })
    })

}