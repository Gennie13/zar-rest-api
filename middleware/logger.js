const MyError = require("../utils/myError");
const asyncHandler = require("./asyncHandler");

exports.Logger = asyncHandler(async (req, res, next) => {
    console.log("cookies--->" , req.cookies.token)
    // let token;
    // console.log(req.userId +"--------------loggerUserId")
    // if(!req.headers.authorization){
    //     throw new MyError("таны эрх хүрэхгүй байна", 400); 
    // };
    // token = await req.headers.authorization.split(" ")[1];
    // let user = jwt.verify(token, process.env.JWT_Secret);
    // req.userId = user.id;
    // console.log(user); 
    console.log(`${req.method} ${req.protocol} `);
    next() ;
});
