const socketIo = require('socket.io');
const chats = require('../Models/chatAppSchema');
const users = require('../Models/userSchema');
const { socketChatMessage } = require('./socketChatMessages');
const { socketIdUpdater, socketDisconnect } = require('./socketIdUpdater');
const { socketReqNotification } = require('./Sockets/socketReqNotification');
const Server = require('socket.io').Server;
// const {io} = require('../index')

// let io; // Declare io variable

const socketIoHandler = (server)=>{
    console.log('Innside');

    io = new Server(server, {
        cors:{
            origin: "*",
            credentials: true
        }
    })
    
    io.on('connection', (socket) => {
        console.log('New client connected', "id", socket.id);

        // Use the socketChatMessage function from the separate module
        socket.on('chat message', (message) => socketChatMessage(socket, io, message));

        // Use the handleChatMessage function from the separate module
        socket.on('save connectid', (message) => socketIdUpdater(socket, io, message));

        // Use the handleChatMessage function from the separate module
        socket.on('Request Notification', (message) => socketReqNotification(socket, io, message));
         
        socket.on('disconnect', async () => {
            console.log('Client disconnected');

            // To disconnect and set the isOnline s
            // socket.on('DisconnetId', (message) => socketDisconnect(socket, message));

        });
    });
}

module.exports = {socketIoHandler};

