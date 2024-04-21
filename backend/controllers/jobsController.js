
const Job = require('../models/jobModel')
const JobType = require('../models/jobTypeModel')
const ErrorResponse = require('../utils/errorResponse')


//create job
exports.createJob = async(req,res,next) =>{
    try {
        const job = await Job.create({
            title: req.body.title,
            description: req.body.description,
            salary: req.body.salary,
            location: req.body.location,
            // available: req.body.available,
            jobType: req.body.jobType,
            user: req.user.id  //to know which user created the job 
        });
        res.status(201).json ({
            success: true,
            job
        })
    } catch (error) {
        next(error)
    }
}

//creating a route for this further to this

//creating controller for single job control or to show single job

exports.singleJob = async(req,res,next) =>{
    try {
        const job=await Job.findById(req.params.id)
        res.status(200).json ({
            success: true,
            job
        })

    } catch (error) {
        next(error)
    }
}

//now create route for this controller

//creating a controller to update a job by id

exports.updateJob = async(req,res,next)=>{
    try {
        //populate means we will have the fields from user model and also from job type model and also selecting which fields we are gonna have
        const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, {new: true}).populate('jobType','jobTypeName').populate('user', 'firstName lastName') //new is true to return the only updated job
        //populate('jobtype') because job is linked to job type therefore to see the job category did this
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}

//now create a route for this controller

// now creating a showJobs controller

exports.showJobs = async(req,res,next) => {

    //enabling search
    const keyword = req.query.keyword ? { //to deal with any type of query use req.query
        title:{
            $regex: req.query.keyword, 
            $options: 'i' //$ is used to remove case sensitivity
        }
    }: {};

    //to filter the query use spread operater ...

    //filtering by category ids
    //for this need to import jobTypeModel

    let ids = []; //an id array
    const jobTypeCategory = await JobType.find({}, {_id: 1}); //_id: 1 to say that we want to have only ids

    //then sending jobTypeCategory to response below

    //mapping jobtypecategory for each to make a loop
    ids= jobTypeCategory.map(cat =>
        cat._id 
    ); // pushing the id from the jobTypeCtaegory;

    //adding filter
    let cat= req.query.cat || '';;
    let categ = cat !== '' ? cat: ids; //if category is not empty then show the filtered category ids else all the ids
    //after this add this to filter parametr of Job.find 

    // display jobs by location
    let locations = [];
    const jobByLocation = await Job.find({}, { location: 1})
    locations= jobByLocation.map(val =>
        val.location
    );

    //to remove multiple appearance of same location
    let setUniqueLocation = [...new Set(locations)]

    //filtering location
    let location = req.query.location || '';
    let locationFilter = location !== ''? location : setUniqueLocation;

    //enabling pagination
    const pageSize = 3; //5 jobs per page
    const page= Number(req.query.pageNumber) || 1;
    // const count = await Job.find({}).estimatedDocumentCount();

    //since estimated document count doesn't accept filter
    const count = await Job.find({...keyword , jobType: categ, location: locationFilter}).countDocuments(); //filtering is used here also so that according to filter the pagination works accordingly
    // filetring by category of jobType since job model has property jobType

    try {
        //to sort the jobs applied according to date in descending order
        const jobs=await Job.find({...keyword, jobType: categ, location: locationFilter})
        .sort({ createdAt: -1})
        .populate('jobType', 'jobTypeName')
        .populate('user','firstName')
        .skip(pageSize * (page-1))
        .limit(pageSize)


        // console.log(jobs)
        res.status(200).json({
            success: true,
            jobs,
            page, //current page
            pages: Math.ceil(count/ pageSize), //how many pages are there
            count,
            setUniqueLocation
            // locations
            // setUniqueLocation
            // jobTypeCategory
            // ids
        });
    } catch (error) {
        next(error);
    }
    
}

//creating route after this


