import {clerkClient} from "@clerk/express"

export const protectAdmin = async (req,res,next) => {
    try {
        const {userId}= req.auth() // this auth() comes from clerk Middleware
        if(!userId){
          return res.json({success:false, message: "Not authenticated(user not exist)" });
        }

        const user = await clerkClient.users.getUser(userId)
        if(user.privateMetadata.role !== "admin"){
            return res.json({success:false, message:"Not Authorized(not admin)"})
        }
        next()
    } catch (error) {
        return res.json({success:false, message:"Not Authorized(server error)"})
    }
}