/* import Express */
const express = require('express')

/* import lofgiscs */
const userLogic = require('../controllers/userLogic')
const jobPostsLogic = require('../controllers/jobPostsLogic')
const chatMessagesLogics = require('../controllers/chatMessagesLogics')

const jwtMiddleware = require('../Middleware/jwtMiddleware')
const multerConfig = require('../Middleware/multerMiddleware')
const jobPostMulter = require('../Middleware/jobPostMulter')


/* object for class router in express */
const router = new express.Router()

/* Routes */

/* Register */
router.post('/user/register', userLogic.register)

/* Register */
router.post('/user/login', userLogic.login)

// //get user current user to update the session
// router.get('/user/session/:userId', jwtMiddleware, userLogic.getChatMessages)

//Logout setting Offline
router.put('/user/logout', jwtMiddleware, userLogic.logout)

//updateUser
router.put('/user/update', jwtMiddleware, multerConfig.single("profileImg"), userLogic.updateUser)

//get user job post
router.get('/user/:id', jwtMiddleware, userLogic.getUserData)

//add job post
router.post('/job/post', jwtMiddleware, jobPostMulter, jobPostsLogic.jobPost)

//get all job post
router.get('/job/post', jwtMiddleware, jobPostsLogic.getJobPosts)

//get currentUsers job post
router.get('/job/post/currentuser', jwtMiddleware, jobPostsLogic.getCurrentUserJobPosts)

//get currentUsers job post
router.get('/job/post/myworks', jwtMiddleware, jobPostsLogic.getMyWorks)

//get selected job post
router.get('/job/post/data/:jobPostId', jwtMiddleware, jobPostsLogic.getJobPost)

//get selected job post
router.get('/job/post/data/:jobPostId', jwtMiddleware, jobPostsLogic.getJobPost)

//request-task
router.post('/job/request-task', jwtMiddleware, jobPostsLogic.requestJobTasks)

//get requested users
router.get('/job/post/requesteduser/:jobPostId', jwtMiddleware, jobPostsLogic.getRequestedUsers)

//request-task
router.put('/job/post/updaterequest', jwtMiddleware, jobPostsLogic.updateRequestJobTasks)

// // cancel/delete-task
router.delete('/job/delete-task/:requestId', jwtMiddleware, jobPostsLogic.deleteJobTasks)

//get user chats
router.get('/chats/:senderId/:receiverId', jwtMiddleware, chatMessagesLogics.getChatMessages)

//get getChatPreview
router.get('/user/contacted/:userId', jwtMiddleware, chatMessagesLogics.getChatPreview)


/* export Router */
module.exports = router