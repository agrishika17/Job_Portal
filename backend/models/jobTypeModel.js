
const mongoose = require('mongoose')

const {ObjectId} = mongoose.Schema;

const jobTypeSchema = new mongoose.Schema({
    jobTypeName: {
        type: String,
        trim: true,
        required: [true, 'Job Category is required'],
        maxLength: 70,
    }, //while testing in postman, only need to mention the job type name and it will automaticaaly authorize the user and user id

    user: {
        type: ObjectId,
        ref: "User", 
        required: true
        
    }

}, {timestamps: true})

module.exports = mongoose.model("JobType",jobTypeSchema)


//create jobType controller now