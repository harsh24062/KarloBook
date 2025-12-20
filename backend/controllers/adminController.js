import Booking from "../model/Booking.js"
import showModel from "../model/Show.js"
import userModel from "../model/User.js"
import Booking from "../model/Booking.js"

// API to check if user is admin
export const isAdmin = async (req,res) => {
    res.json({success:true, isAdmin:true})
}

// API TO get Admin DashBoard Data
export const getDashboardData = async (req,res) => {
    try {
        const bookings = await Booking.find({isPaid:true})
        const activeShows = await showModel.find({showDateTime:{$gte:new Date()}}).populate("movie")
        
        const totalUser = await userModel.countDocuments()

        const dashboardData ={
            totalBookings:bookings.length,
            totalRevenue:bookings.reduce((acc,booking)=>acc+booking.amount,0),
            activeShows,
            totalUser
        }
        res.json({success:true,dashboardData})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

// API TO get all shows
export const getAllShows = async(req,res) => {
    try {
      const shows = await showModel.find({showDateTime:{$gte:new Date()}}).populate("movie").
      sort({showDateTime:1})
      res.json({success:true,shows})
    } catch (error) {
       console.error(error)
       res.json({success:false,message:error.message}) 
    }
}


// API TU get all bookings
export const getAllBookings = async (req,res) => {
    try {
        const bookings = await Booking.find({}).populate("user").populate({
            path:"show",
            populate:{path:"movie"}
        }).sort({createdAt:-1})
        res.json({success:true,bookings})
    } catch (error) {
       console.error(error)
       res.json({success:false,message:error.message}) 
    }
}