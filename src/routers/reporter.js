const express = require('express')
const router = new express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middelware/auth')
const multer = require('multer')
router.post('/reporters',async(req,res)=>{
    try{
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter, token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/reporters',auth,(req,res) =>{
    Reporter.find({}).then((reporters) =>{
        res.status(200).send(reporters)
    })
    .catch((error)=>{
        res.status(500).send(error)
    })
})

router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
})




router.get('/reporters/:id',auth,(req,res) =>{
const _id = req.params.id
Reporter.findById(_id).then((reporter) =>{
    if(!reporter){
        return res.status(404).send('unable to find reporter')
    }
    res.status(200).send(reporter)
}).catch((error)=>{
    res.status(500).send(error)
})
})




router.patch('/reporters/:id',auth,async (req, res) =>{
try{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "password"]
    var isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('no update')
    }
    const _id = req.params.id
    const reporter = await Reporter.findByIdAndUpdate(_id)
    if (!reporter){
        return res.status(404).send('there is no reporter')
    }
    updates.forEach((update)=>reporter[update]=req.body[update])
    await reporter.save()
    res.status(200).send(reporter)
}


catch(error){
    res.status(400).send('error' +error)
}

})
router.delete('/reporters/:id',auth,async(req,res) =>{
    try{
        const _id = req.params.id
        const reporter = await Reporter.findByIdAndDelete(_id)
        if(!reporter){
            return res.status(404).send('there is no reporter')
        } 
        res.status(200).send(reporter)
    }
    catch(error){
        res.status(400).send('error' +error)
    }
    
})

router.post('/reporters/login', async(req, res) =>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(error){
        res.status(400).send("error"+error)
    }
})

router.delete('/logout', auth, async (req, res) => {
    try {
        req.reporter.tokens = req.reporter.tokens.filter((el) => {
             return el.token !== req.token
        })
        await req.reporter.save()
        res.send('Logout Success')
         
    }
    catch(e) {
        res.status(500).send(e)
    }
})


router.delete('/logoutall', auth,async (req, res) => {
    try {
        req.reporter.tokens=[]
        await req.reporter.save()
        res.send('Logout all was done successfully')
    }
    catch (e) {
        res.status(500).send(e)
    }
 })

 const uploads = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('you must upload image'))
        }
        cb(null,true)
        
    }
})

router.post('/reporterimage',auth, uploads.single('avatar'),async(req, res) => {
    try {
        req.reporter.reportersImage = req.file.buffer
        await req.reporter.save()
        res.send('image is uploaded')
    }
    catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router