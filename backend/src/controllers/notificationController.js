import Notification from "../models/Notification.js";

export const getNotifications = async(req,res) => {
    try {
        const {userId} = req.params;
        const notification = await Notification.find({userId}).sort({createdAt: -1});
        res.status(200).json(notification);
    }catch(error){
        res.status(500).json({message: "Server error"});
    }
}

export const markAsRead = async(req,res) => {
    try {
        const {notificationId} = req.params;
        await Notification.findByIdAndUpdate(notificationId, {read: true});
        res.status(200).json(
            {message: "Notification marked as read"});
    
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
}
export const clearNotifications = async(req,res) => {
    try {
        await Notification.deleteMany(
            {userId: req.user._id});
        res.status(200).json(
            {message: "Notifications cleared"});
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
}