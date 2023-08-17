import jwt from "jsonwebtoken";
import userModel from "../modules/userModel.js";

// Protect routes token based
export const requireSignIn = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }   
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Login Error",
            error: err.message,
        });
    }
}

// admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){
            return res.send({
                success: false,
                message: "Admin resource. Access denied",
            });
        }else{
            next();
        }
    } catch (error) {
        console.log(error)
    }
}