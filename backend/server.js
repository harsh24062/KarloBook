import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import dotenv from "dotenv";

// read .env file
dotenv.config()

const app = express()
const port = 3000

// Database conncetion
await connectDB()

// Middleware
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    return res.json({
        msg:"Hi there"
    })
})

app.listen(port,()=>{
    console.log("Server started at port:",port)
})