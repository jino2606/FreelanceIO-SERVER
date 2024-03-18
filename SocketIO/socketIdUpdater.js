const users = require("../Models/userSchema");

const socketIdUpdater = async (socket, io, message) => {
    console.log('Received message:', message, "id", socket.id);

    try {
        const userId = message;
        console.log(userId);

        const updateUser = await users.findByIdAndUpdate(userId ,{socketId: socket.id, isOnline: true},{new:true});
        console.log("updateUserupdateUserupdateUser");

    } catch (error) {
        console.error('Error saving message to MongoDB:', error);
    }
};

const socketDisconnect = async (socket, message) => {
    console.log('Received message:', message, "id", socket.id);

    try {
        const userId = message;
        console.log(userId);

        await users.findByIdAndUpdate(userId ,{socketId: null, isOnline: false},{new:true});
        console.log("update offline");

    } catch (error) {
        console.error('Error saving message to MongoDB:', error);
    }
};

module.exports = {
    socketIdUpdater,
    socketDisconnect
};
