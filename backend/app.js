const express=require("express");
const app=express(); //is above morgan so that we use it as a parameter in one of the express functions.. example in line 19
const mongoose=require("mongoose");
const morgan=require("morgan"); //very useful middleware
const bodyParser=require("body-parser");
require("dotenv").config();
var cors=require("cors");
const cookieParser = require("cookie-parser");
//importing my errorHandler function
const errorHandler=require("./middleware/error")


//import routes
const authRoutes=require('./routes/authRoutes')
const userRoutes=require('./routes/userRoutes')
const jobsTypeRoutes = require('./routes/jobsTypeRoutes')
const jobsRoutes = require('./routes/jobsRoutes')



//database connection
mongoose.connect(process.env.DATABASE,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true //this are no longer needed in new version
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(()=>console.log("DB Connected"))
.catch((err)=>console.log(err));

//MIDDLEWARE
app.use(morgan('dev'))
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cookieParser())  //cookie parser bcoz we need cookie in order to authenticate
app.use(cors())  //added cors to make requests to the backend

// //ROUTES MIDDLEWARE
// app.get('/',(req,res)=>{
//     res.send("Hello from Node Js")
// })
//all apis will have a prefix of api
//this means my site will run at eg: localhost:8000/api
app.use('/api',authRoutes)
//GET /api 200 mean ssuccessful response

app.use('/api',userRoutes)

//passing job type routes as middleware
app.use('/api', jobsTypeRoutes)

app.use('/api',jobsRoutes)



// error middleware
app.use(errorHandler); //using our custom errors


//port
const port=process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})

