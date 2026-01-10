import { inngest } from "../inngest/index.js"
import Booking from "../model/Booking.js"
import showModel from "../model/Show.js"
import stripe from "stripe"

// check availablity of selected seat for a movie
const checkSeatsAvailability = async (showId,selectedSeats) => {
  try {
    const showData = await showModel.findById(showId)
    if(!showData) return false
    
    const occupiedSeats = showData.occupiedSeats
    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])
    return !isAnySeatTaken
  } catch (error) {
     console.error(error)
     return false
  }
}

// create booking
export const createBooking = async (req,res) => {
    try {
        const {userId} = req.auth()
        const {showId, selectedSeats} = req.body
        const {origin} = req.headers // frontend url

        // check if the seat is available for the selectedSeats
        const isAvailable = await checkSeatsAvailability(showId,selectedSeats)
        
        if(!isAvailable){
          return res.json({success:false, message:"Selected seats are not available"})
        }

        // Get show details
        const showData = await showModel.findById(showId).populate("movie")

        //create new Booking
        const booking = await Booking.create({
          user:userId,
          show:showId,
          amount:showData.showPrice*selectedSeats.length,
          bookedSeats:selectedSeats
        })

        selectedSeats.map(seat => {
          showData.occupiedSeats[seat]=userId
        })

        showData.markModified("occupiedSeats")
        await showData.save()

        //stripe GateWay initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        // creating line_items
        const line_items =[{
          price_data:{
            currency:"usd",
            product_data:{
              name:showData.movie.title
            },
            unit_amount: Math.floor(booking.amount)*100
          },
          quantity:1
        }]
      
        const session  = await stripeInstance.checkout.sessions.create({
          success_url:`${origin}/loading/my-bookings`,
          cancel_url:`${origin}/my-bookings`,
          line_items:line_items,
          mode:"payment",
          metadata:{
            bookingId:booking._id.toString()
          },
          expires_at:Math.floor(Date.now()/1000) + 30*60,
           //expire in 30 mins
        })
        
        booking.paymentLink=session.url
        await booking.save()
        // run Inngest schedular Function to check payment status after 10 mintues
        await inngest.send({
          name:"app/checkpayment",
          data:{
            bookingId:booking._id.toString()
          }
        }) 
        res.json({success:true, message:"Booked successfully",url:session.url})
    } catch (error) {
        console.error(error)
        res.json({success:false, message:error.message})
    }
}

// return occupied seats
export const getOccupiedSeats = async (req,res) => {
  try {
    const {showId} = req.params
    const showData = await showModel.findById(showId)

    const occupiedSeats = Object.keys(showData.occupiedSeats)

    res.json({success:true, occupiedSeats})
  } catch (error) {
    console.error(error)
    res.json({success:false,message:error.message})
  }
}
