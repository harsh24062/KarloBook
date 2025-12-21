import express from 'express'
import { addAndUpdateFavorite, getFavorite, getUserBookings } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get("/bookings",getUserBookings)
userRouter.post("/update-favorite",addAndUpdateFavorite)
userRouter.get("/favorites",getFavorite)

export default userRouter