//we need express

const express=require('express')
// const {signin} = require('../controllers/authController')

const router=express.Router();
const {signup,signin,logout,userProfile} = require('../controllers/authController')
const {isAuthenticated} = require ('../middleware/auth')


//auth routes

//since we need to put our logic as second parameter therefore commenting this 
// router.get('/',(req,res)=>{
//     res.send("Hello from Node Js")
// })


// //auth routes
// router.get('/',signin)

//auth Routes
// /api/signup
router.post('/signup', signup)//post request

// /api/signin
router.post('/signin', signin) //post request

// /api/logout
router.get('/logout', logout)  //get request

// /api/me  //for userProfile authorization
//user should be authenticated to see his profile
router.get('/me', isAuthenticated, userProfile) //isAuthenticated middleware is between route  and data controller 


//export router in order to use it in our files
module.exports=router;