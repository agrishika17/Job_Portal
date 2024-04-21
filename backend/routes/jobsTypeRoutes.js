
const express= require('express')
const router = express.Router()
const {createJobType, allJobsType, updateJobType, deleteJobType} =require ('../controllers/jobsTypeController')
const {isAuthenticated, isAdmin} = require('../middleware/auth')

//job type routes
 
// /api/type/create
router.post('/type/create', isAuthenticated, createJobType) //createJobType method crreated in job type controller
 //now to bring job type route in main app importing this file in app.js

// /api/type/jobs
router.get('/type/jobs', allJobsType)

//after this created jobsController.js

// /api/type/update/type_id
router.put('/type/update/:type_id', isAuthenticated ,isAdmin, updateJobType)

// /api/type/delete/type_id
router.delete('/type/delete/:type_id', isAuthenticated, isAdmin, deleteJobType)

module.exports = router;