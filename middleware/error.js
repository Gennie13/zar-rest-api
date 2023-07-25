//garsan aldaand msj yvuuldag aldaani message
const errorHandler = (err, req, res, next) => {
    console.log(err)
    // const err = { ... err };
    if(err.name === 'CastError'){
        err.message = "Энэ ID буруу бүтэцтэй ID байна! ";
        err.statusCode = 400;
    }
    if(err.name === 'JsonWebTokenError' && err.message === "invalid token"){
        err.message = "Энэ буруу token байна! ";
        err.statusCode = 400;
    }
//zariin ner davhardah aldaa orj ZASAH
    if(err.code === 11000 ){
        err.message = "Утгыг давхардуулж болохгүй, шалгаад дахин оруулна уу?  ";
        err.statusCode = 400;
    }
    res.status(err.statusCode || 501).json({
        success: false,
        error: err.message
    });
};
module.exports = errorHandler