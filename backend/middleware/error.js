//we are gonna handle our errors here 
//this means each time we have an error in our backend API, we would know exactly what it is and we would also know the codeStatus

const ErrorResponse = require("../utils/errorResponse") //importing our errorResponse from utils folder

//own error function with parameters error, request, response and next [next is to go to the next middleware]
const errorHandler = (err, req, res, next)=>{
    let error={...err}
    error.message= err.message;

    if(err.name=== "CastError"){
        const message=`Resource not found ${err.value}`;
        error=new ErrorResponse(message, 404)  //2 param. message and codeStatus  
    }

    //Mongoose duplicate value 
    if(err.code=== 11000){
        const message="Duplicate field value entered";
        error=new ErrorResponse(message, 400) //400 means that authorization is not given
    }

    //Mongoose validation error

    //This might have one or more errors thus we use Object.values() that will return an array
    //passing the err.errors to target the errors and mapping through each error 
    //then adding val and some space to separate different errors and concatenating val.message

    if(err.name==="ValidationError"){
        const message=Object.values(err.errors).map(val => ' ' + val.message);
        error=new ErrorResponse(message, 400) //400 means that authorization is not given
    }

    //to have our status
    //500 is for server error
    res.status(error.codeStatus || 500).json({
        success: false,
        error: error.message || "server error"
    })

}

//export our function to use in other files

module.exports = errorHandler;

//using this in app.js