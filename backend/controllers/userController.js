import Booking from '../model/Booking.js'
import {clerkClient} from '@clerk/express'
import movieModel from '../model/Movie.js'

// API to get all booking of user
export const getUserBookings = async (req,res) => {
    try {
        const user  = req.auth().userId
        
        const bookings = await Booking.find({user}).populate({
            path:"show",
            populate:{path:"movie"}
        }).sort({createdAt:-1})
        res.json({success:true,bookings})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

// API to Add and update Favorite Movie in Clerk user Metadata
export const addAndUpdateFavorite = async (req,res) => {
    try {
        const {movieId} = req.body
        const userId = req.auth.userId

        const user = await clerkClient.users.getUser(userId)

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = []
        }

        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item!==movieId)
        }

        await clerkClient.users.updateUserMetadata(userId,{
            privateMetadata:user.privateMetadata
        })

        res.json({success:true,message:"Favorite Movie Updated successfully"})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}


// get All favorite movies
export const getFavorite = async (req,res) => {
    try {
        const userId = req.auth().userId
        const user = await clerkClient.users.getUser(userId)
        const favorites = user.privateMetadata.favorites

        const movies = await movieModel.find({_id:{$in:favorites}})
        res.json({success:true,movies})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}