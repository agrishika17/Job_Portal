
const mongoose = require('mongoose')

const {ObjectId} = mongoose.Schema; //to create table or document relationship like MySQL a little bit
// const bcrypt = require('bcryptjs')
// const jwt= require('jsonwebtoken')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required'],
        maxLength: 70,
    },

    description: {
        type: String,
        trim: true,
        required: [true, 'Description is required'],
        // maxLength: 70,
    },
    salary: {
        type: String,
        trim: true,
        required: [true, 'Salary is required'],
    },
    location: {
        type: String,
    },
    available: {  //whether job is available or not
        type: Boolean,
        default: true
    },
    //linking job model to user model
    jobType: {
        type: ObjectId,
        ref: "JobType",  //the name given to job type model while exporting 
        required: true
        
    },

    user: {
        //extract object id from mongoose.schema
        //and pass the reference
        type: ObjectId,
        ref: "User", //"User name is same as given to user model while exporting"
        required: true
        
    }

}, {timestamps: true})

module.exports = mongoose.model("Job",jobSchema)