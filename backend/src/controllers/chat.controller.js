import { generateStreamToken } from "../../config/stream.js";

export const getStreamToken =  (req, res) => {
    try{
        const token  = generateStreamToken(req.user.id);

        res.status(200).json({ token });
    } catch(error){
        console.log("Error in getStreamToken Controller:", error.messsage);

        res.status(500).json({ message: "Internal Server Error"});
    }
}