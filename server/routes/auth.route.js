import express from 'express';
import {signup,Signin,Google,signOut} from '../controllers/auth.controller.js';
const router=express.Router();
router.post("/signup",signup);
router.post("/signin",Signin);
router.post("/google",Google);
router.get("/signout",signOut);
export default router;