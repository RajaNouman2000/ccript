import express from 'express'
import {getUsers}  from "../controllers/user.js";


export const userRouter = express.Router();

userRouter.get("/users" ,getUsers);


export default {userRouter};