const chats = require("../Models/chatAppSchema");
const users = require("../Models/userSchema");


const socketChatMessage = async (socket, io, message) => {
    console.log('Received message:', message, "id", socket.id);

    try {
        const { senderId, receiverId, text, isContacted } = message;
        console.log(senderId, receiverId, text, isContacted);

        // Insert the message into the messages collection
        const chatMesage = new chats({
            senderId,
            receiverId,
            text,
            timestamp: new Date(),
        });
        await chatMesage.save();

        // const receiverSocketId = await users.findOne({_id: receiverId}).socketId
        const receiverSocketId = await users.find({_id: receiverId},{socketId:1,_id:0});

        console.log("receiverSocketId receiverSocketId", receiverSocketId[0].socketId);

        // An array of socket IDs (`socketIds`)
        const socketIds = []; /* array of socket IDs */

        socketIds.push(socket.id);
        socketIds.push(receiverSocketId[0].socketId);

        /* This is to make an array of users who made contact with the user.
            Im sending a flag that if he is already contacted or not , if not then im adding to the list.
            Im doing this at the frontend cause to avoid query every time an user sends a message.
            We should only do this if only the frontend is strong. Now doing it just to avoid an extra query 
        */
        if (!isContacted) {
            await users.updateOne(
                { _id: senderId },
                { $addToSet: { contactedUsers: receiverId } }
            );
        }

        // const chatMesage = await chats.deleteMany()
        // io.emit('chat message', chatMesage); // Emit the message to all clients

        
        // Emit an event "chat message" to all clients in the `socketIds` array
        io.to(socketIds).emit("chat message", chatMesage);

    } catch (error) {
        console.error('Error saving message to MongoDB:', error);
    }
};

module.exports = {
    socketChatMessage,
};