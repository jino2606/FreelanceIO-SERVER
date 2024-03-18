const { server } = require("..");
const jobPostRequest = require("../Models/JobPost/jobPostRequestSchema");
const jobPosts = require("../Models/JobPost/jobPostSchema");
const users = require("../Models/userSchema");
const { io } = require("../SocketIO/socketIoHandler")
const mongoose = require('mongoose');


/* import Jwt jsonwebtoken */
const jwt = require('jsonwebtoken')


/* Logic for adding the new Post */
exports.jobPost = async(req, res)=>{
    console.log("Inside Add Projeccts");

    const userId = req.userId
    
    console.log("filenmae", req.files);
    const jobImages = req.files

    const {jobTitle, jobSkills, jobRate, jobDescription} = req.body

    console.log("aJOb post : ",  userId, req.body);

    try {

        const newPost = new jobPosts({
            jobTitle, 
            jobSkills, 
            jobImages, 
            jobRate, 
            jobDescription,
            userId
        })

        await newPost.save()
        res.status(200).json(newPost)
        console.log("Lasttt newPost: ",  newPost);
        
    } catch (error) {
        res.status(401).json(`Request failed due to :${error}`)  
    }
}

/* get all job posts for home */
exports.getJobPosts = async(req, res)=>{
    console.log("Inside getHomeProjects");

    try {

        /* Now we are limimiting to take only 40 data */
           const allPosts = await jobPosts.aggregate([
            {
                $limit: 40
            },
            {
                $lookup: {
                    from: 'users',  // "users" is the name of your users collection
                    localField: 'userId',  // "userId" is the field in jobPosts collection
                    foreignField: '_id',   // "_id" is the field in users collection
                    as: 'user'  
                }
            }
        ]) ;                                            
        // .find().limit(40)
        res.status(200).json(allPosts)
        
    } catch (error) {
        res.status(401).json(`Request failed due to ${error}`)
    }
}

/* get only current useres Job post */
exports.getCurrentUserJobPosts = async(req, res)=>{
    console.log("Inside getCurrentUserJobPosts");
    const userId = req.userId

    console.log("Inside getCurrentUserJobPosts", userId);
    try {

        /* Now we are limimiting to take only 40 data */
        //    const currentUserPosts = await jobPosts.aggregate([
        //     // {
        //     //     $limit: 40
        //     // },
        //     {
        //         $match: {
        //             userId: new mongoose.Types.ObjectId(userId) // Assuming userId is stored as ObjectId
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'users',  // "users" is the name of your users collection
        //             localField: 'userId',  // "userId" is the field in jobPosts collection
        //             foreignField: '_id',   // "_id" is the field in users collection
        //             as: 'user'  
        //         }
        //     }
        // ])   
        const currentUserPosts = await jobPosts.find({ userId: userId });
        console.log("Inside After get find");  

        // Get the IDs of job posts created by the user
        const currentUserPostIds = currentUserPosts.map(post => post._id);
        console.log("Inside After get mapp");  

        // Find job post requests associated with the user's posts
        const jobPostRequests = await jobPostRequest.find({ jobPostId: { $in: currentUserPostIds } });

        // // Get the job post IDs from the requests
        // const requestedJobPostIds = jobPostRequests.map(request => request.jobPostId);

        console.log("Inside After get getCurrentUserJobPosts");  

        res.status(200).json(currentUserPosts)
        
    } catch (error) {
        res.status(401).json(`Request failed due to ${error}`)
        console.log("Inside getCurrentUserJobPosts", error);
    }
}

/* get selected job post for viewJob */
exports.getJobPost = async(req, res)=>{
    console.log("Inside getHomeProjects");
    const userId = req.userId
    const {jobPostId} = req.params
    try {
        const jobPost = await jobPosts.findById(jobPostId)
                        .populate('userId')
        console.log("Inside Try find getHomeProjects");
        if (!jobPost) {
            throw new Error('Job post not found');
        }

        console.log("Inside Agter Populate getHomeProjects");

        // Access the user data from the populated field
        const jobPoster = jobPost.userId;

        const jobPostRequests = await jobPostRequest.findOne({jobPostId: jobPostId, requestedUserId: userId})
        console.log("Inside POster user ID getHomeProjects",jobPostId,"idd", userId);

        // Return both the job post and the associated user data
        res.status(200).json({ jobPost, jobPoster, jobPostRequests });

    } catch (error) {
        // Handle any errors
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching job post with user data.' });}
}

/* Logic for saving the request from a user for a project and to emit via socket to the other user */
exports.requestJobTasks = async(req, res)=>{
    
    console.log("Inside requestJobTasks");

    const userId = req.userId

    const { jobPostId, requestType} = req.body

    console.log("aJOb post rewuestwqw: ",  userId, req.body);

    try {

        const newPostRequest = new jobPostRequest({
            jobPostId, 
            requestedUserId: userId, 
            requestType,
            state:0
        })

        await newPostRequest.save()

        res.status(200).json(newPostRequest)
        console.log("Lasttt newPost: ",  newPostRequest);
        
    } catch (error) {
        res.status(401).json(`Request failed due to :${error}`)  
    }
}

exports.updateRequestJobTasks = async(req, res)=>{
    
    console.log("Inside updateRequestJobTasks");

    const userId = req.userId

    const { requestId, requestedUserId, jobPostId, state} = req.body

    console.log("aJOb post rewuestwqw: ",  userId, req.body);

    try {

        await jobPostRequest.updateOne({ _id: requestId }, { requestedUserId: requestedUserId, state: state, requestType: state });

        /* Now to update the Job post also */
        await jobPosts.updateOne({ jobPostId }, { state: state });
        
        console.log(updatePostRequest);

        res.sendStatus(200);
        
    } catch (error) {
        res.status(401).json(`Request failed due to :${error}`)  
    }
}

/* get getRequestedUsers for Job post */
exports.getRequestedUsers = async(req, res)=>{
    console.log("Inside getRequestedUsers");

    const userId = req.userId
    const {jobPostId} = req.params

    console.log("Inside getRequestedUsers", userId);
    try {

           const requestedUsers = await jobPostRequest.aggregate([
            {
                $match: {
                    jobPostId: new mongoose.Types.ObjectId(jobPostId) // Assuming userId is stored as ObjectId
                }
            },
            {
                $lookup: {
                    from: 'users',  // "users" is the name of your users collection
                    localField: 'requestedUserId',  // "userId" is the field in jobPosts collection
                    foreignField: '_id',   // "_id" is the field in users collection
                    as: 'user'  
                }
            }
        ])   
        // const currentUserPosts = await jobPosts.find({ userId: userId });
        // console.log("Inside After get find");  

        // const currentUserPostIds = currentUserPosts.map(post => post._id);
        // console.log("Inside After get mapp");  

        // const jobPostRequests = await jobPostRequest.find({ jobPostId: { $in: currentUserPostIds } });

        // // Get the job post IDs from the requests
        // const requestedJobPostIds = jobPostRequests.map(request => request.jobPostId);

        console.log("Inside After get getCurrentUserJobPosts");  

        res.status(200).json(requestedUsers)
        
    } catch (error) {
        res.status(401).json(`Request failed due to ${error}`)
        console.log("Inside getCurrentUserJobPosts", error);
    }
}

/* Getting Requested users using RequestedUserId for My Works  Page */
exports.getMyWorks = async(req, res)=>{
    console.log("Inside getCurrentUserJobPosts");

    const userId = req.userId

    console.log("Inside getCurrentUserJobPosts", userId);
    try {

        const myWorks = await jobPostRequest.find({ requestedUserId: userId })
        .populate({
            path: 'jobPostId',
            model: 'jobPosts'
        })
        .exec();

        // const myWorks = await jobPostRequest.find({ requestedUserId: userId });
        console.log("Inside After get find");  

        res.status(200).json(myWorks)
        
    } catch (error) {
        res.status(401).json(`Request failed due to ${error}`)
        console.log("Inside getCurrentUserJobPosts", error);
    }
}

/* Logic for adding the new Post */
exports.deleteJobTasks = async(req, res)=>{
    
    console.log("Inside requestJobTasks");

    const {requestId} = req.params

    try {

        const deleteRequest = await jobPostRequest.deleteOne({_id: requestId})

        if (deleteRequest.deletedCount === 1) { /* deletedCount returned by deleteOne() */
        // If the request was successfully deleted
        res.status(200).json({ message: "Request deleted successfully" });
        } else {
        // If the request was not found or could not be deleted
        res.status(404).json({ error: "Request not found or could not be deleted" });
        }
        
    } catch (error) {
        res.status(401).json(`Request failed due to :${error}`)  
    }
}

//delete project
exports.deleteUserProject = async(req,res)=>{

    const {id}=req.params

    try {
        //deleteOne - can be used by the deleteOne method will return true or false - i need to get thr deleted document to send response
         const removeProject = await projects.findByIdAndDelete({_id:id})
         res.status(200).json(removeProject)
        
    } catch (err) {
       res.status(401).json(err)  
    }
}