const users = require("../Models/userSchema");


/* import Jwt jsonwebtoken */
const jwt = require('jsonwebtoken')


/* logic for register */
exports.register = async(req, res)=>{

    console.log(req.body);
    const {username, email, password, firstname, lastname} = req.body

    try {
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(406).json("Account Already Exist... Please Login")
        }
        else{
            /* creating a new user object. user is model*/
            const newUser = new users({
                username: username,
                firstname,
                lastname,
                email,
                password,
                isOnline: false /* initially setting isOnline to false when registering */
            })

            /* saving in db */
            await newUser.save()

            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(401).json(`Register request failed. error: ${error}`)
    }
}


/* Logic for Login */
exports.login = async(req, res)=>{

    console.log("Inside Login Function");
    const {email, password} = req.body
    console.log(email,password);
    try{
        /* Checking if the email and password is present in the documents */
        const userCheck = await users.findOne({email: email, password: password})
        if(userCheck){
            /* Update the isOnline state to true */
            await users.updateOne({ _id: userCheck._id }, { isOnline: true });

            /* creating token using jwt token jwt sign method */
            /* passing the user id taken from the usercheck value, Give a secret key  */
            /* the payload is passed secrectly through the token the token will hold the user id  */
            const token = jwt.sign({userId: userCheck.id}, "mySecrectKeyForProject")
            console.log("token", token);

            res.status(200).json({
                loggedInUser: userCheck,
                token: token
            })
        }
        else{
            res.status(404).json("Invalid Email or Password")
            // No need for 'return;' here, but adding it can enhance readability
            return
        }
    }
    catch(err){
        res.status(401).json(`Login failed: ${err.message}`);
    }
}


/* Logic for Login */
exports.logout = async(req, res)=>{

    console.log("Inside Logout Function");
    const userId = req.userId
    try{
        /* Update the isOnline state to true */
        await users.updateOne({ _id: userId }, { isOnline: false });
        // res.status(200).json({})
        res.sendStatus(200);
    }
    catch(err){
        res.status(401).json(`Logout failed: ${err.message}`);
    }
}

//update profile
exports.updateUser = async(req,res)=>{
    /*  */
    const userId = req.userId
    console.log("pass 1");
    const {username,firstname,lastname,email,password,jobTitle,education,userDescription,github,linkedin,profile,address1,address2,city,state,zipcode,profileImg} = req.body
    console.log("pass 2");

    const uploadImage = req.file
    // ?req.file.filename:profileImg
    console.log("pass 3");

    try {
        // console.log("token", token);
        const updateUser = await users.findByIdAndUpdate({_id:userId},{username,firstname,lastname,jobTitle,education,userDescription,email,password,github,linkedin,profile,address1,address2,city,state,zipcode,profileImg:uploadImage},{new:true})
        console.log("updateUserupdateUserupdateUser", updateUser);
        // await updateUser.save()
        res.status(200).json(updateUser)

    } catch (err) {
        res.status(401).json(err)
    }

}


//getUserData get an user 
exports.getUserData = async(req,res)=>{

    const {id}= req.params

    console.log("user ised oaram", id);

    try {
         const userData = await users.findOne({_id:id})
         res.status(200).json(userData)
        
    } catch (err) {
       res.status(401).json(err)  
    }
}