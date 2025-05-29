import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUser = await User.find({
            $and: [
                {_id: {$ne: currentUserId}}, //exclude current user
                {_id: {$ne: currentUser.friends }}, //exclude current user's friends
                {isOnboarded: true}, 
            ],
        });
        res.status(200).json(recommendedUser);
    } catch (error) {
        console.error("Error in getRecommmendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const getMyFriends = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch(error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
};

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        //prevent sending req to yourself
        if(myId === recipientId) {
            return res.status(400).json({ message: "You can't send friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message: "Recipient not found"});
        }

        //check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
        });

        if(existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user"});
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
};



