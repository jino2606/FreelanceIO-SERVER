/* import mongoose */
const mongoose = require('mongoose')

const validator = require('validator')
const { array } = require('../Middleware/multerMiddleware')

/* Creating schema using schema inside mongose */
const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        min: [3, 'Must be at least 3, got {VALUE}']
    },
    firstname:{
        type: String,
        required: true,
        min: [3, 'Must be at least 3, got {VALUE}']
    },
    lastname:{
        type: String,
        required: true,
        min: [3, 'Must be at least 3, got {VALUE}']
    },
    email:{
        type:String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        required: true
    },
    jobTitle:{
        type:String,
        default: ''
    },
    education:{
        type:String,
        default: ''
    },
    userDescription:{
        type:String,
        default: ''
    },
    github:{
        type:String,
        default: ''
    },
    linkedin:{
        type:String,
        default: ''
    },
    profile:{
        type:String,
        default: ''
    },
    address1:{
        type: String,
        min: [3, 'Must be at least 3, got {VALUE}'],
        default: ''
    },
    address2:{
        type: String,
        min: [3, 'Must be at least 3, got {VALUE}'],
        default: ''
    },
    city:{
        type: String,
        min: [3, 'Must be at least 3, got {VALUE}'],
        default: ''
    },
    state:{
        type: String,
        min: [3, 'Must be at least 3, got {VALUE}'],
        default: ''
    },
    zipcode:{
        type: String,
        min: [6, 'Must be at least 6, got {VALUE}'],
        default: ''
    },
    profileImg:{
        type: Array,
        default: []
    },
    contactedUsers:{
        type: Array,
        default: []
    },
    socketId: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    isOnline: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

/* create model using model */
const users = mongoose.model("user", userSchema)

/* Export Model */
module.exports = users