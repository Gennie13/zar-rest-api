const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const MyError = require("../utils/myError");
const userModel = require("../models/user");

exports.protect = asyncHandler(async(req, res, next) => {
    let token = null;

    if(req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies){
        token = req.cookies["token-id"];
    }
    // const token = req.headers.authorization.split(" ")[1];

    if(!token) {
        // throw new MyError("Токен байхгүй байна?", 401);
        throw new MyError("Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та нэвтэрч орно уу? Токеноо шалгана уу?", 401)
    };    
    //token shalgah
    const tokenObject = jwt.verify(token, process.env.JWT_SALT);

    req.user = await userModel.findById(tokenObject.id);
    // console.log(tokenObject)
    // console.log(req.user)
    
    //login hiisnee save
    req.userId = tokenObject.id;
    req.userRole = tokenObject.role;
    req.userName = req.user.name;
    next();
});


exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.userRole)){
            throw new MyError("Таны эрх ["+req.userRole+"] энэ үйлдлийг хийх боломжгүй", 403)
        };
        next()
    };
} ;