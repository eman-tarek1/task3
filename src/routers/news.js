const express = require('express')
const router = new express.Router()
const News = require('../models/news')
const auth = require('../middelware/auth')
const multer = require('multer')

router.post('/news',auth,async(req,res) =>{
    try{
        const news = new News({...req.body,owner:req.reporter._id})
        await news.save()
        res.status(200).send(news)

    }
    catch(error){
        res.status(400).send(error)
    }

})

router.get('/news', async(req,res) =>{
   try{
       const news = await News.find({})
       res.status(200).send(news)
   }
   catch(error){
       res.status(500).send(error)
   }
})


router.get('/news/:id', auth , async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if (!news) {
            return res.status(404).send('news is not found ')
        }
        res.status(200).send(news)
    }
    catch(error){
        res.status(500).send(error)
    }
})

router.patch('/news/:id',auth ,async (req, res) => {
    try {
        const update = Object.keys(req.body)
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('news is not found')
        }
        update.forEach((el) => news[el] = req.body[el])
        await news.save()
        res.send(news)
    }
    catch (error){
        res.status(400).send(error)
    }
})


router.delete('/news/:id' , auth , async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('news is not found')
        }
        res.status(200).send(news)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

router.get('/reporterNews/:id',auth ,async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if (!news) {
            return res.status(404).send('news is not found')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)
    }
    catch (error) {
        res.status(500).send(error)
    }
})
 

const uploads = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('you must upload images only'))
        }
        cb(null,true)
    }
})

router.post('/newsimage/:id',auth, uploads.single('avatar'),async(req, res) => {
    try {
       const _id = req.params.id
       const news = await News.findById(_id)
        if(!news){
           res.status(404).send('cannot upload image ')
        }
        news.newsImage = req.file.buffer
        await news.save()
        res.send('image is uploaded')
    }
    catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router



