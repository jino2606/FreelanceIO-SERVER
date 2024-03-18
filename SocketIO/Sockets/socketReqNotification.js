const users = require("../../Models/userSchema");


const socketReqNotification = async (socket, io, message) => {

    const { jobPosterId, notification } = message;

    // An array of socket IDs (`socketIds`)
    const socketIds = []; /* array of socket IDs */

    const receiverSocketId = await users.find({_id: jobPosterId},{socketId:1,_id:0});

    console.log("receiverSocketId receiverSocketId", receiverSocketId[0].socketId);
    
    socketIds.push(receiverSocketId[0].socketId);

    // Emit an event "chat message" to all clients in the `socketIds` array
    io.to(socketIds).emit("Request Notification", notification);

    console.log("Emoitted Reque");
}

module.exports = {
    socketReqNotification,
};