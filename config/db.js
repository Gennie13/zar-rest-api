const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({path: "./config.env"});
const asyncHandler = require("../middleware/asyncHandler");
const dbURL = process.env.MONGODB_URL;

//database 
const connectDB = asyncHandler( async() => {
    const connection = await mongoose.connect( dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=> console.log('Connected to MongoDB'))
});
module.exports = connectDB;