const express=require('express')
const router=express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')

const Poem=require('../dbModels/Poem')

//@desc Login/Landing Page
//@route GET/
router.get('/', ensureGuest, (req,res)=>{
    res.render('login', {
        layout: 'login',
    })
})

//@desc Login/Landing Page
//@route GET/
router.get('/dashboard', ensureAuth, (req,res)=>{
    try{
        const poems=await Poem.find({ author:req.author.googleId}).lean()
        res.render('dashboard',{
            name: req.user.displayName,
        })
    }catch(err){
        console.error(err)

    }
   
})



module.exports=router
