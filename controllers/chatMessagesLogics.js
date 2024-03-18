const chats = require("../Models/chatAppSchema");
const users = require("../Models/userSchema");


//get chats
exports.getChatMessages = async(req,res)=>{

    const {senderId, receiverId} = req.params
    // console.log("indife ised oaram", receiverId);

    // console.log("user ised oaram", id);

    try {
         const chatMessages = await chats.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
         })

         res.status(200).json(chatMessages)
        
    } catch (err) {
       res.status(401).json(err)  
    }
}


//get chats thumnails
exports.getChatPreview = async(req,res)=>{

    const { userId } = req.params

    try {
        const userData = await users.findOne({_id: userId});

        if (userData) {
            // Access the specified field
            const contactedUsers = userData['contactedUsers'];
            console.log(`found found found  not found.`);

            // const newPost = new jobPosts({
            //     jobTitle, 
            //     jobSkills, 
            //     jobImages, 
            //     jobRate, 
            //     jobDescription,
            //     userId
            // })

            if(contactedUsers.length>0){
                console.log(`found contactedUsers.`);

                // const chatData = users.find({_id: contactedUsers})
                // console.log(`found found found.`, chatData);

                const chatData = await users.find(

                    { _id: contactedUsers }, // Query

                    { 
                        username: 1,
                        firstname:1,
                        lastname:1,
                        profileImg: 1
                    } // Projection: Include only the field

                )
                // console.log(`final.`, chatData);

                res.status(200).json(chatData)
            }else{
                res.status(404).json({ message: 'Data not found' });
                return;
            }


        } else {
            res.status(404).json({ error: "User Not Found" });
            return;
        }
        
        // const contactedUsers = await userData

        // console.log("ucontactedUsers ser ised oaram", userData);


        //  const chatMessages = await chats.find({
        //     $or: [
        //         { senderId: senderId, receiverId: receiverId },
        //         { senderId: receiverId, receiverId: senderId }
        //     ]
        //  })

         
        
    } catch (err) {
       res.status(401).json(err)  
    }
}