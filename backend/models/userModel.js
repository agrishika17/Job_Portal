//models are the way to define the fields that the document needs

const mongoose =require('mongoose')
const {ObjectId} = mongoose.Schema;
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken")

//adding jobHistory feature

const jobsHistorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxLength: 70,
    },

    description: {
        type: String,
        trim: true,
        // maxLength: 70,
    },
    salary: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
    },
    interviewDate: {
        type: Date,
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],  //a sort of vaidation type
        default: 'pending',
    },
    user: {
        //extract object id from mongoose.schema
        //and pass the reference
        type: ObjectId,
        ref: "User", //"User name is same as given to user model while exporting"
        required: true
        
    }

}, {timestamps: true})

//add this in the user controller for this feature after this and after adding this in the user scehma as well

const userSchema=new mongoose.Schema({

    firstName: {
        type: String,
        trim: true, //to remove space
        required: [true, 'first name is required'], //to write our custom message that first name is required 
        maxlength: 32,
    },
    lastName: {
        type: String,
        trim: true, //to remove space
        required: [true, 'last name is required'], //to write our custom message that first name is required 
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true, //to remove space
        required: [true, 'e-mail is required'], //to write our custom message that first name is required 
        unique: true, //since email need to be unique
        match: [
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              'Please add a valid email'
        ]
    },
    password: {
        type: String,
        trim: true, //to remove space
        required: [true, 'password is required'], //to write our custom message that first name is required 
        minlength: [8,'password must have atleast (8) characters'],
    },

    jobsHistory: [jobsHistorySchema], //adding this so that user can update the status accordingly

    role: {
        type: Number,
        //can use string as well and can set default as user or admin in string
        default: 0
    }
}, {timestamps: true} ) //timestamps to create to new field i.e. period date and updated date

//since before saving the password in database we need to encrypt it, thus
//encrypting password before saving using bcrypt
userSchema.pre('save',async function(next) { //next means after this middleware go to next phase
    if(!this.isModified('password')){ //if password is not modified
        next() //go to next phase
    }
    this.password=await bcrypt.hash(this.password,10)
})
//now need to add sign up controller

//after adding sign up

//compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// return a JWT token
userSchema.methods.getJwtToken = function (){
    return jwt.sign({id: this.id}, process.env.JWT_SECRET,{
        expiresIn: 3600 //the cookie expiration and token expiration should be same
    }); //this id is basically the payload of the currently logged user
}


module.exports=mongoose.model("User",userSchema)