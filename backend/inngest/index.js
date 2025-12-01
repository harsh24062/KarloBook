// from Inngest Docs, Ignore 2. Step

import { Inngest } from "inngest";
import userModel from "../model/User.js"

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//Inngest Function to save user data to a database
const userCreation = inngest.createFunction(
    {id:"user-create-with-clerk"},
    {event:"clerk/user.created"},
    async ({event}) => {
       const {id, fisrt_name, last_name, email_addresses, image_url} = event.data
       const userData = {
        _id:id,
        email:email_addresses[0].email_address,
        name:fisrt_name+" "+last_name,
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
        const {id, fisrt_name, last_name, email_addresses, image_url} = event.data

       const userData = {
        _id:id,
        email:email_addresses[0].email_address,
        name:fisrt_name+" "+last_name,
        image:image_url
       }
       await userModel.findByIdAndUpdate(id,userData)
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [userCreation,userDeletion,userUpdation];