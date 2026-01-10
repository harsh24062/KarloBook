import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import dotenv from "dotenv";
import { clerkMiddleware } from '@clerk/express'
import { functions, inngest } from "./inngest/index.js"
import { serve } from "inngest/express"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

// read .env file
dotenv.config()

const app = express()
const port = 3000

// Database conncetion
await connectDB()

//stripe webhook
app.use("/api/stripe",express.raw({type:"application/json"}),stripeWebhooks)

// Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

app.get("/",(req,res)=>{
    return res.json({
        msg:"Hi there"
    })
})
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show",showRouter)
app.use("/api/booking",bookingRouter)
app.use("/api/admin",adminRouter)
app.use("/api/user",userRouter)

app.listen(port,()=>{
    console.log("Server started at port:",port)
})