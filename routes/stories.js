const express=require('express')
const router=express.Router()
const {ensureAuth} = require('../middleware/auth')
const Poem=require('../dbModels/Poem')

//@desc Show add page
//@route GET /stories/add
router.get('/add', ensureAuth, (req,res)=>{
    res.render('stories/add')
})

//@desc Process add form
//@route GET /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Poem.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

//@desc Show add page
//@route GET /stories
router.get('/', ensureAuth, async (req,res)=>{
    try{
        const stories = await Poem.find({status: 'public'})
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()

        res.render('stories/index', {
            stories,
        })
    }catch (e) {
        console.error(e)
        res.render('error/500')
    }
})

module.exports=router
