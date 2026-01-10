// from Inngest Docs, Ignore 2. Step

import { Inngest } from "inngest";
import userModel from "../model/User.js"
import Booking from "../model/Booking.js";
import showModel from "../model/Show.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking",
    eventKey:process.env.INNGEST_EVENT_KEY
 });

//Inngest Function to save user data to a database
const userCreation = inngest.createFunction(
    {id:"user-create-with-clerk"},
    {event:"clerk/user.created"},
    async ({event}) => {
       const {id, first_name, last_name, email_addresses, image_url} = event.data
       const userData = {
        _id:id,
        email:email_addresses[0].email_address,
        name:first_name+" "+last_name,
        image:image_url
       }
       await userModel.create(userData)
    }
)

//Inngest Function to delete user data from database
const userDeletion = inngest.createFunction(
    {id:"user-delete-with-clerk"},
    {event:"clerk/user.deleted"},
    async ({event}) => {
      const {id} = event.data
      await userModel.findByIdAndDelete(id)
    }
)

//Inngest Function to update user data In database
const userUpdation = inngest.createFunction(
    {id:"user-update-with-clerk"},
    {event:"clerk/user.updated"},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data

       const userData = {
        _id:id,
        email:email_addresses[0].email_address,
        name:first_name+" "+last_name,
        image:image_url
       }
       await userModel.findByIdAndUpdate(id,userData)
    }
)

//Inngest function to cancel booking and release seats of shows 
// after 10 mintues of booking created if not made 
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    {id:"release-seats-delete-booking"},
    {event:"app/checkpayment"},
    async ({event,step})=>{
        const tenMinutesLater = new Date(Date.now() + 10*60*1000)
        await step.sleepUntil("wait-for-10-mintues",tenMinutesLater)
        await step.run("check-payment-status",async()=>{
          const bookingId = event.data.bookingId;
          const booking = await Booking.findById(bookingId);

          // if payment is not made, release seats and delete booking
          if(!booking.isPaid){
            const show = await showModel.findById(booking.show)
            booking.bookedSeats.forEach((seat)=>{
                delete show.occupiedSeats[seat]
            });
            show.markModified("occupiedSeats")
            await show.save()
            await Booking.findByIdAndDelete(booking._id)
          } 
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [userCreation,userDeletion,userUpdation,releaseSeatsAndDeleteBooking];