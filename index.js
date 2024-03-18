/* import dotenv */
require('dotenv').config()

/* import Express */
const express = require('express')

/* import socketio */
const http = require('http');
const {socketIoHandler} = require('./SocketIO/socketIoHandler')

/* import cors */
const cors = require('cors')

/* Router import */
const router = require('./Routes/Router');
const { socketIoEmitter } = require('./controllers/jobPostsLogic');

/* import connection file */
require('./DB/connections')

/* create app server */
const app = express()

/* For SocketIo */
const server = http.createServer(app);

socketIoHandler(server);
// socketIoEmitter(server);


/* use cors */
app.use(cors())

/* should come above router */
app.use(express.json())

/* use router */
app.use(router)

/* projectFairServer should use the upl;oad folder */
/* first arguent to specify the name so how the othe apps (frontend) can use it or call it */
/* second args is to exporting the folder to use it */
app.use('/uploads', express.static('./uploads/profile/profileImage'))

app.use('/uploads/job/posts', express.static('./uploads/job/posts'))

/* customise the port */
const PORT = 4000 || process.env.PORT

/* runserver */
server.listen(PORT, ()=>{
    console.log(`FreelancingApp-Server started at http://localhost:${PORT} and waiting for the request....`);
})

// app.get('/', (re, res)=>{
//     res.send("Got  GET")
// })
