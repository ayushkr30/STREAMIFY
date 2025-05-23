import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;

    try {
        if(!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required"});
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex) {
            return res.status(400).json({ message: "Invalid Email Format"});
        }

        const existingUser = await User.findOne({ email });
        if(!existingUser){
            return res.status(400).json({ message: "Account already registered using this email please try a different email or go to Login page for Sign-in"});
        }

        const idx = Math.floor(Math.random()*100)+1; // generate a num b/w 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email, fullName, password, profilePic: randomAvatar,
        });
        
        //TODO:  Stream adds-on
        
        //JWT TOKEN
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true, //prevent XSS attack
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({ success: "true", user: newUser });
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}