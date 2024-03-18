const mongoose = require('mongoose');

/* create a schema from mongoose */
const jobPostSchema = new mongoose.Schema({

    jobTitle:{
        type:String,
        require: true,
    },
    jobSkills:{
        type:Array,
        require:true
    },
    jobImages:{
        type:Array,
        require:true
    },
    jobRate:{
        type:String,
        require:true
    },
    jobDescription:{
        type:String,
        require:true
    },
    state: {
        type: Number,
        required: true,
        enum: [0, 1, 2], // Define the possible numerical values for the state , {open, Engaged, Closed}
        default: 0 // Set the default value to 0
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require:true
    }
}, { timestamps: true })

/* create a model from mongoose */
const jobPosts = mongoose.model("jobPosts", jobPostSchema)

module.exports = jobPosts