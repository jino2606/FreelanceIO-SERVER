const mongoose = require('mongoose');

/* create a schema from mongoose */
const jobPostRequestSchema = new mongoose.Schema({

    jobPostId: {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    requestedUserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    requestType: {
        type: Number,
        required: true,
        enum: [0, 1, 2], // states like [Requested, Cancel Task, Finished]
    },
    state: {
        type: Number,
        required: true,
        enum: [0, 1, 2], // Define the possible numerical values for the state , {open, Engaged, Closed}
        default: 0 // Set the default value to 0
    }

}, { timestamps: true })

/* Below validation is not working properly so for now it is commented. From fromend now its kind of validated */

// Define a compound unique index on jobPostId and userId fields
/* jobPostRequestSchema.index({ jobPostId: 1, userId: 1 }, { unique: true }); */  /* To ensure that a user can have only one entry for a specific jobPostId */

/* create a model from mongoose */
const jobPostRequest = mongoose.model("jobPostRequest", jobPostRequestSchema)

module.exports = jobPostRequest