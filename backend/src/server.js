import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import  authRoutes  from "./routes/auth.route.js";
import { connectDB } from "../config/db.js";
dotenv.config();



const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:5001", credentials: true}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);

connectDB().then(()=> {
     app.listen(PORT, ()=> {
    console.log("Server is running on", PORT);
   });
})
