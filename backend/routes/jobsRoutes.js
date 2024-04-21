
const express = require('express')
const router = express.Router()
const {createJob, singleJob, updateJob, showJobs} = require('../controllers/jobsController')
const {isAuthenticated, isAdmin} = require('../middleware/auth')


//jobs routes

// /api/job/create
router.post('/job/create', isAuthenticated, isAdmin, createJob) //only admins can create jobs

// /api/job/:id //colon is very imp here to find the job by id
router.get('/job/:id', singleJob)

// /api/job/update/job_id  //since in jobsController updateJob we have names the parameter as req.params.job_id
router.put('/job/update/:job_id', isAuthenticated, isAdmin, updateJob)

// /api/jobs/show
router.get('/jobs/show', showJobs)

module.exports = router


//after this import this file in app.js