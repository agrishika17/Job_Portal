
//authentication and authorization are both different
//authentication means user need to have the correct credentials in order to log in 
//in authorization even if the user is authenticated, it may not have the right to access some resourcess


const ErrorResponse = require('../utils/errorResponse'); //for our custom message
const jwt = require('jsonwebtoken'); 
const User = require("../models/userModel")

//check if user is not authenticated  
//if user is not authenticated then it will not have access
exports.isAuthenticated = async (req,res,next) => {
    //naming our cookie as token
    const {token} = req.cookies;   //extracting the token
     
    //Make sure token exists
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route', 401))
        
    }   

    try{
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //adding a property to the request
        req.user = await User.findById(decoded.id);
        next();

    }catch (error) {
        return next(new ErrorResponse('Not authorized to access this route',401));
    }
}

//middleware for admin i.e only admin can access this
exports.isAdmin = async (req,res,next) => {
    if(req.user.role === 0){
        return next(new ErrorResponse("Access denied, you must be an admin",401))
    }
    next(); //go to next middleware and this step is very imp.
}