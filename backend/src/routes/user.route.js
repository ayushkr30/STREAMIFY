import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router  = express.Router();

//apply auth middleware to all routes
router.use(protectRoute);




export default router;