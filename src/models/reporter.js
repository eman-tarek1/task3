const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const reporterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength:5
    },
    age:{
        type: Number,
        required: 25,
       validate(value) {
    if (value < 0){
        throw new Error('age must be positive')
     
    }
     }
    },
    phonenumber: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isMobilePhone(value, 'ar-EG')){
                throw new Error('phone is invalid');
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],

    
reportersImage:{
    type:Buffer
}

},
{
    timestamps:true
}
)


    reporterSchema.pre('save',async function(next){
        const reporter = this
        console.log(reporter)
        if (reporter.isModified('password')){
            reporter.password = await bcrypt.hash(reporter.password, 8)
        }
      
       next()
    })
    reporterSchema.statics.findByCredentials = async (email, password) => {
        const reporter = await  Reporter.findOne({ email: email })
        if(!reporter){
            throw new Error('please sign up')
        }
        console.log(reporter)
        const isMatch = await bcrypt.compare(password, reporter.password)
        if(!isMatch){
            throw new Error('unable to login')
        }
        return reporter
    }
    
    reporterSchema.methods.generateToken = async function (){
        const reporter = this
        console.log(reporter)
        const token = jwt.sign({_id:reporter._id.toString()}, 'node-course')
        reporter.tokens = reporter.tokens.concat({token})
        await reporter.save()
        return token
    }
    
    reporterSchema.methods.toJSON = function () {
        const reporter = this
        
        const reporterObject = reporter.toObject()
        delete reporterObject.password
        delete reporterObject.tokens
    
        return reporterObject
    }

    reporterSchema.virtual('news', {
        ref: 'News',
        localField: '_id',
        foreignField:'owner'
    })
    
const Reporter = mongoose.model('Reporter',reporterSchema  )

module.exports=Reporter