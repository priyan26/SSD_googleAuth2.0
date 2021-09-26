const express=require('express')
const router=express.Router()
const {ensureAuth} = require('../middleware/auth')
const Poem=require('../dbModels/Poem')

//@desc Show add page
//@route GET /poems/add
router.get('/add', ensureAuth, (req,res)=>{
    res.render('stories/add')
})

//@desc Process add form
//@route GET /poems
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

//@desc Show single story page
//@route GET /stories/:id
router.get('/:id', ensureAuth, async(req,res)=>{
    try {
        let poem=await Poem.findById(req.params.id)
        .populate('user')
        .lean()

        if(!poem){
            return res.render('error/404')
        }

        res.render('stories/show',{
            poem
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

//@desc Show edit page
//@route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req,res)=>{
    try {
        const poem=await Poem.findOne({
            _id:req.params.id,
        }).lean()

        if(!poem){
            return res.render('error/404')
        }
        if(poem.user!=req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit',{
                poem,
            })
        }
    }catch (e) {
        console.error(e)
        return res.render('error/500')
    }
})

//@desc Update story
//@route PUT /stories/:id
router.put('/:id', ensureAuth, async (req,res)=>{
    try {
        let story = await Poem.findById(req.params.id).lean()

        if (!story){
            return res.render('error/404')
        }

        if(story.user!=req.user.id){
            res.redirect('/stories')
        }else{
            story = await Poem.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }
    }catch (e) {
        console.error(e)
        return res.render('error/500')
    }
})

//@desc Delete story
//@route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req,res)=>{
    try {
        await Poem.remove({_id: req.params.id})
        res.redirect('/dashboard')
    }catch (e) {
        console.error(e)
        return res.render('error/500')
    }
})

//@desc User stories
//@route GET /stories/user/:userId
router.get('/user/:userId', ensureAuth,async (req,res)=>{
    try {
        const stories=await Poem.find({
            user:req.params.userId,
            stat:'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index',{
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
module.exports=router
