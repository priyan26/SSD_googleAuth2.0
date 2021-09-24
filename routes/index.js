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
router.get('/dashboard', ensureAuth, async (req,res)=>{
    try{
        const poems=await Poem.find({ user:req.user.id}).lean()
        res.render('dashboard',{
            name: req.user.displayName,
            poems,
        })
    }catch(err){
        console.error(err)
        res.render('error/500')

    }
   
})



module.exports=router
