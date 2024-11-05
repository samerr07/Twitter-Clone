const express = require('express');
const dotenv = require('dotenv');
const databaseConnection = require('./config/database');
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/userRoutes");
const tweetRouter = require("./routes/tweetRoutes");
const cors = require("cors")
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2
const path = require("path");


dotenv.config();

const server = express();
const _dirname = path.resolve();


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});


//Connecting a Database
databaseConnection();

//middlewares
server.use(bodyParser.json({ limit: '10mb' }));  // Set the limit according to your need

// Increase the body size limit for URL-encoded bodies
server.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
server.use(express.urlencoded({
    extended:true
}));
server.use(express.json());
// server.use(express.urlencoded({extended:true}));
server.use(cookieParser());
const corsOptions = {
    origin:true,
    credentials:true
}
server.use(cors(corsOptions))

server.use("/api/v1/user" , userRouter.router);
server.use("/api/v1/tweet", tweetRouter.router);


server.use(express.static(path.join(_dirname, "/client/dist")));
server.get('*', (_,res) => {
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

// server.get("/",(req,res)=>{
//     res.json("Server Started !!")
// })


server.listen(8080,()=>{
    console.log("Server Started")
})