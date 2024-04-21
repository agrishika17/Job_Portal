
const User = require('../models/userModel')
const ErrorResponse = require('../utils/errorResponse')

//load or display all users
exports.allUsers = async (req,res,next) => {
    //enable pagination
    const pageSize=10;
    const page= Number(req.query.pageNumber) || 1;
    const count= await User.find({}).estimatedDocumentCount();

    try {
        //while displaying the users we are gonna display by the last and write 1 to display by the first and also remove the password from the result
        const users= await User.find().sort({ createAt: -1}).select('-password') //meant to display all the users
             //to enable pagination    
            .skip(pageSize* (page-1)) //to skip pagesize
            .limit(pageSize) //to limit the pagesize

        res.status(200).json ({ //json response for frontend
            success: true,
            users,
            page,
            pages: Math.ceil(count / pageSize),
            count
        })
        next();
//now created  a user route in a new file

    } catch (error) {
        return next(error);
    }
}

//to show single user
exports.singleUser = async (req,res,next)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        })
        next();
    }catch(error) {
        return next(error);
    }
}

//edit user
exports.editUser = async (req,res,next)=>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true}); //new true is meant to display the new upadated user
        res.status(200).json({
            success: true,
            user
        })
        next();
    }catch(error) {
        return next(error);
    }

}

//delete a user
exports.deleteUser= async (req,res,next) => {
    try{
        const user= await User.findByIdAndDelete(req.params.id); //findByIdAndRemove is not working
        res.status(200).json ({
            success: true,
            message: "User Deleted"
        })
        next();
    }catch(error){
        return next(error);
    }
}

//jobs history

exports.createUserJobsHistory = async(req,res,next) =>{
    //extracting fields required using req.body
    const {title, description, salary, location} = req.body
    //also need to check if the current user is signed in
    try {
        const currentUser = await User.findOne({_id: req.user._id})
        if(!currentUser){
            return next(new ErrorResponse("You must Log In.", 401)) //401 means unauthorized

        }else{
            const addJobHistory = {
                title, 
                description, 
                salary, 
                location,
                user: req.user._id
            }
            //adding newly applied job to the job history
            currentUser.jobsHistory.push(addJobHistory) //jobsHistory property of user Model in userSchema function
            //since each time the user applies we need to push the object so that it holds multiple values
            await currentUser.save()
        }
        res.status(200).json({
            success: true,
            currentUser
        })
        next();
    } catch (error) {
        next(error)
    }
}

//creating route for newly added job history controller
