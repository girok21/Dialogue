import jwt from 'jsonwebtoken';
import UserModel from '../Models/UserModel.js';

const protect = async(req, res, next) => {
    let token;
    //Read the JWT token rom the cookie
    token = req.cookies.jwt;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await UserModel.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            return res.status(401).json(error);
        }
    }else{
        return res.status(401).json('Unauthorized access, No token found');     
    }
}

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        return res.status(401).json('Unauthorized access, Admin access required');     
    }
}

export { protect, admin }