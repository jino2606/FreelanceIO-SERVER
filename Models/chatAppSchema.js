/* import mongoose */
const mongoose = require('mongoose')

/* Creating schema using schema inside mongose */
const chatsSchema = mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users' // Assuming 'User' is the name of the referenced collection
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users' // Assuming 'User' is the name of the referenced collection
    },
    text:{
        type: String,
        required: true,
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
}, { timestamps: true }) /* Post.find({ createdAt: { $gte: yesterday, $lt: today } }) */

/* create model using model */
const chats = mongoose.model("chats", chatsSchema)

/* Export Model */
module.exports = chats