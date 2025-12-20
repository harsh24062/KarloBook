import Booking from "../model/Booking.js"
import showModel from "../model/Show.js"

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

        res.json({success:true, message:"Booked successfully"})
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
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
