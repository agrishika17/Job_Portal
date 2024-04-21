//importing userModel to create sign up controller
const User=require('../models/userModel')
const ErrorResponse= require('../utils/errorResponse')


//mvc pattern i.e model view controller
// exports.signin= (req,res)=>{
//     res.send('Hello from Node Js');
// }

exports.signup = async (req,res,next) => {
    //grabbing the email from the request body
    //this is the done with the help of body parser and all the data will come from it
    const {email} = req.body;
    //check if user exists
    const userExist = await User.findOne({email});
    if( userExist ) {
        return next(new ErrorResponse("E-mail already registered", 400));
    }
    try{
        const user= await User.create(req.body);
        res.status(201).json({
            success: true, //send success to frontend and also the data using user
            //to show that user is created
            user
        })
    } catch(error){
        next(error);
    }
}

exports.signin = async (req,res,next) => {
    
    try{
        const {email, password} = req.body;
        //Validation
        if( !email ) {
            const message="Please add an email";
            return next(new ErrorResponse(message, 403));
        }
        if( !password ) {
            return next(new ErrorResponse("Please add a password", 403));
        }

        //check user email
        const user = await User.findOne({email});
        if( !user ) {
            return next(new ErrorResponse("Invalid credentials", 400));
        }

        //check password
        const isMatched = await user.comparePassword(password);
        if( !isMatched ){
            return next(new ErrorResponse("Invalid Password",400));
        }

        //this function will receive three parameters user, status code and response
        sendTokenResponse(user, 200, res);


    } catch(error){
        next(error);
    }
}

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    res
        .status(codeStatus)
        .cookie('token', token, {maxAge: 60*60*1000, httpOnly: true}) //cookie should expire in 1 hour //httpOnly true means cookie is accessible in http only and can do httpsOnly true as well
        .json({success: true,
              role: user.role
        }) //to send something to frontend

}

//log out feature
exports.logout= (req,res,next) => {
    res.clearCookie('token'); //this will come from cookieParser
    res.status(200).json({
        success: true,
        message: "Logged out successfully!"
    });

}

//user profile 
exports.userProfile= async (req,res,next) => {
    // no need of cokie here
    // res.clearCookie('token'); //this will come from cookieParser
    const user = await User.findById(req.user.id).select('-password'); //removing password from the response  //req.user field used in auth.js file

    res.status(200).json({ //for sending some info to front end
        success: true,
        user
    });

}

