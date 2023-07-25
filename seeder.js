const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config/config.env"});
const Category = require("./models/categoryModel");
const Zar = require("./models/zarModel");
const User = require("./models/user");
const Comment = require("./models/comment");

mongoose.connect( process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//stringees ob bolgono
const categories = JSON.parse(fs.readFileSync(__dirname + "/data/categoryData.js", "utf-8"));
const zaruud = JSON.parse(fs.readFileSync(__dirname + "/data/zarData.js", "utf-8"));
const users = JSON.parse(fs.readFileSync(__dirname + "/data/userData.js", "utf-8"));

const importData = async() => {
    try{
        await Category.create(categories);
        await User.create(users);
        await Zar.create(zaruud);
        console.log("Датаг импортолж дууссан")
    } catch(err) {
        console.log(err)
    }
};
const deleteData = async() => {
    try{
        await Category.deleteMany();
        await Zar.deleteMany();
        await User.deleteMany();
        console.log("Датаг устгаж дууссан")
    } catch(err) {
        console.log(err)
    }
}

if(process.argv[2] === "-i"){
    importData()
} else if (process.argv[2] === "-d"){
    deleteData()
}