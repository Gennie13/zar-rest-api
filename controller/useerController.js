const UserModel = require("../models/user");
const MyError = require("../utils/myError");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

//register
exports.createRegisterUser = asyncHandler(async(req, res, next) => {
    const user = await UserModel.create(req.body);
    const jwt = user.getJsonWebToken();

    res.status(200).json({
        success: true,
        token: jwt,
        data: user
    })
})

//login
exports.login = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new MyError("Мэйл болон нууц үгээ шалгана уу?", 400);
    }

    const user = await UserModel.findOne({email}).select('+password');
    if(!user){
        throw new MyError("Мэйл эсвэл нууц үг буруу байна аа?", 401);
    }

    const pass = await user.checkPassword(password)
    if(!pass){
        throw new MyError("Мэйл эсвэл нууц үг буруу байна аа?", 402);
    }
    const token = user.getJsonWebToken();
    //cookie hadgalah hugatsaa
    const cookieOption = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
    //cookie dotor huvisagch hadgalah
    res.status(200).cookie('token-id', token, cookieOption).json({
        success: true,
        token,
        data: user
    });
});
exports.logOut = asyncHandler(async(req, res, next) => {
    const cookieOption = {
        expires: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    };
    
    res.status(200).cookie('token-id', null, cookieOption).json({
        success: true,
        data: "logged out ;) "
    })
});



exports.getUsers = asyncHandler ( async ( req, res, next ) => {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    ['page', 'limit'].forEach( el => delete req.query[el]);
   
    const total = await UserModel.countDocuments();
    const pageCount = Math.ceil( total / limit );
    const start = ( page - 1 ) * limit + 1;
    let end = start + limit - 1;
    if(end > total ) end = total;

    const pagination = {total, pageCount, start, end};

    if(page < pageCount) pagination.nextPage = page + 1;
    if(page > 1) pagination.prevPage = page - 1;

    const users = await UserModel.find().skip(start-1).limit(limit);
    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
        pagination
    })
});
exports.getUser = asyncHandler ( async ( req, res, next ) => {
    const user = await UserModel.findById(req.params.id);
    if(!user){
        throw new MyError(req.params.id + " хэрэглэгч олдсонгүй ", 401)
    }
    res.status(200).json({
        success: true,
        data: user
    })
})
exports.updateUser = asyncHandler(async(req, res, next) => {
    // req.body.updateUser = req.userId;
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if(!user) {
        throw new MyError( req.params.id + " хэрэглэгчийн мэдээллээ шалгана уу? Засварлаж чадсангүй", 402)
    };
    
    res.status(200).json({
        success: true,
        data: user
    })
})
exports.deleteUser = asyncHandler(async(req, res, next) => {
    // req.body.deleteUser = req.userId;
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if(!user) {
        throw new MyError( req.params.id + " хэрэглэгчийн мэдээллээ шалгана уу? Устгаж чадсангүй", 403)
    };
    res.status(200).json({
        success: true,
        data: user,
    })
})


//forgot-password
exports.postUserForgotPassword = asyncHandler(async (req, res, next) => {
    if (!req.body.email) {
        throw new MyError(req.body.email + " хэрэглэгч олдсонгүй ", 401);
    }

    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
        throw new MyError(req.params.id + " хэрэглэгч олдсонгүй ", 401);
    }

    const resetToken = await user.changePassToken();
    await user.save();


    const link = `http://localhost:3000/change-password/${resetToken}`;
    const message = `Сайн байна уу? Та нууц үг сэргээх хүсэлт илгээсэн байна. <br> Доорх линкээр дарж орж нууц үгээ сэргээнэ үү? <br><br>${link}<br>`
    const info = await sendEmail({
        email: user.email,
        subject: "Нууц үг өөрчлөх хүсэлт",
        message

    })
    
    console.log("Message sent: %s", message);

    res.status(200).json({
        success: true,
        resetToken, message // Fix this line to use user.resetPasswordToken
    });
});

//reset-password
exports.postUserResetPassword = asyncHandler(async (req, res, next) => {
    if (!req.body.resetToken || !req.body.password) {
        throw new MyError("Та шинэ нууц үг болон токеноо оруулна уу?", 400);
    }
    const encrypted = crypto
        .createHash("sha256")
        .update(req.body.resetToken)
        .digest("hex")

    const user = await UserModel.findOne({ 
        resetPasswordToken: encrypted,
        resetPasswordExpire: { $gt :Date.now()},
    });
    if (!user) {
        throw new MyError("Хүчингүй токен байна", 401);
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    //token ilgeeh
    const token = user.getJsonWebToken();

    res.status(200).json({
        success: true,
        token: token,
        user: user
    });
});