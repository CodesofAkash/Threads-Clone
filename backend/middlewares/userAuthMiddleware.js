import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    try {
        // Try to get token from cookies first
        let token = req.cookies.token;
        
        // If no token in cookies, try Authorization header
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove "Bearer " prefix
            }
        }
        
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}