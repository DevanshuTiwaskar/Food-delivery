import express from 'express';
import { loginUser,registerUser,logout,registerSeller } from '../controllers/userController.js';
const Router = express.Router();

Router.post("/user/register",registerUser);
Router.post("/user/login",loginUser)
Router.post("/seller/register",registerSeller)
Router.post("/seller/login",loginUser);

Router.post('/logout',logout)
export default Router;