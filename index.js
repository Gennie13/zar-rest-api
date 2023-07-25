const express = require("express");
//file systemiin zam hadgalah - morgan, rfs
const morgan = require('morgan');
const rfs = require("rotating-file-stream");
const dotenv = require("dotenv");
//file systemiin zamtai harizah
const path = require("path");
const cookieParser = require('cookie-parser');


const categoryRouter = require("./router/categories");
const zarRouter = require("./router/zaruud");
const userRouter = require("./router/users");
const commentRouter = require("./router/comments");


dotenv.config({path: "./config/config.env"});
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const logger = require("./middleware/logger");
////////////////////////////////////////////////////////////////////////////////////////////////
//emitter
const EventEmitter = require('events');
// Create an instance of EventEmitter
const myEmitter = new EventEmitter();

// Increase the limit of listeners for this specific EventEmitter instance
myEmitter.setMaxListeners(15); // Increase the limit to 15, for example

// Add event listeners as needed
myEmitter.on('event', () => {
  console.log('Event listener called');
});
////////////////////////////////////////////////////////////////////////////////////////////////
const app = express();
connectDB();

//static web- path index.html
app.use(express.static(path.join(__dirname,"public")))
//buh huseltiig log foldert temdeglej avah
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // 1uduruur n
    path: path.join(__dirname, 'log')
})
//req.cookies -> buh req cookie ireh
app.use(cookieParser());
//body parser duudaj datad req uusgeh, express-json()
app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream }));

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/zaruud", zarRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
//err garval next() aldaani message ugnu
app.use(errorHandler);

const server = app.listen(process.env.PORT, console.log(`server ----->  ${process.env.PORT}`));

//system dayar uussen barigdaagui aldaag negdsen bdlaar huleej avna
process.on('unhandledRejection', (err, promise) => {
    console.log(`Алдаа гарлаа ----->  ${err.message}`);
    server.close(()=> {
        process.exit(1);
    });
})
