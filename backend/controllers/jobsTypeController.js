const JobType = require('../models/jobTypeModel')
const ErrorResponse = require('../utils/errorResponse')

//create job category
exports.createJobType = async (req,res,next) => { //this method will be used while creating post requests
    try {
        // const jobT=await jobType.create(req.body) //can do like this since we will receive all the fields by using req.body but since we nee to check the user authentication and get the user adding the job 
        //we do like this..
        const jobT= await JobType.create({
            jobTypeName: req.body.jobTypeName,
            user: req.user.id,//this request the user will have in our middleware
            //since we are using the same word as we used in our auth.js middlewares
        });
        res.status(201).json({
            success:true,
            jobT
        })
    } catch (error) {
        next(error)
    }
}

//now creating the jobtype route in routes folder

//after testing the above controller in postman, adding a new one


//all jobs category
exports.allJobsType = async(req,res,next) => {
    try {
        const jobT = await JobType.find()
        res.status(200).json ({
            success: true,
            jobT
        })
    } catch (error) {
        next(error)
    }
}

//after this creating the route

//update job type
exports.updateJobType = async(req,res,next) =>{
    try {
        const jobT = await JobType.findByIdAndUpdate(req.params.type_id, req.body, {new: true})
        res.status(200).json({
            success: true,
            jobT
        })
    } catch (error) {
        next(error)
    }
} 

//adding route for above updateJobType function after this

// delete job type
exports.deleteJobType = async(req,res,next) =>{
    try {
        const jobT= await JobType.findByIdAndDelete(req.params.type_id)
        res.status(200).json({
            success: true,
            message: "Job Type Deleted" 
        })
    } catch (error) {
        next(new ErrorResponse("server error", 500))
    }
}
//creating route for this