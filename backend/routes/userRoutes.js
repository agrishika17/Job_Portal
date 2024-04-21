

const express=require('express')
const router=express.Router();
const {allUsers,singleUser,editUser, deleteUser, createUserJobsHistory} = require('../controllers/userController')
const {isAuthenticated, isAdmin} = require ('../middleware/auth')

//user routes

// /api/allusers  //for userProfile authorization
//also user should be authenticated to see his profile
// router.get('/allusers', isAuthenticated, allUsers) //isAuthenticated middleware is between route  and data controller 

//and after this import it in main app.js

//since we want only admin to see all the users
//adding this feature we can do using is Admin middleware created in auth.js
router.get('/allusers',isAuthenticated, isAdmin,  allUsers)

// /api/user/id
router.get('/user/:id', isAuthenticated, singleUser);

// /api/user/edit/id
router.put('/user/edit/:id', isAuthenticated, editUser);

// /api/admin/user/delete/id
router.delete('/admin/user/delete/:id', isAuthenticated, isAdmin, deleteUser);

// /api/user/jobhistory
router.post('/user/jobhistory', isAuthenticated, createUserJobsHistory);

//export router in order to use it in our files
module.exports=router;