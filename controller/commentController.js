const MyError = require("../utils/myError")
const asyncHandler = require("express-async-handler");
const ZarModel = require("../models/zarModel");
const userModel = require("../models/user");
const CommentModel = require("../models/comment");

exports.createComment = asyncHandler ( async (req, res, next) => {
    if(!req.body.userId && !req.body.zarId && !req.body.comment){
        throw new MyError("Та мэдээллээ шалгаж үзнэ үү?", 400)
    };
    req.body.userId = req.userId;
    // console.log(req.params._id)
    // req.body.userId = req.params._id;
    // console.log(req.body.userId)
    const zar = await ZarModel.findById(req.body.zarId)
    if(!zar){
        throw new MyError(`${zar} ийм зар байхгүй байна. Та ID шалгана уу? `, 401);
    }
    const comment = await CommentModel.create(req.body);
    res.status(200).json({
        success: true,
        data: comment
    })
});
exports.getComments = asyncHandler ( async ( req, res, next ) => {
    
    const comments = await CommentModel.find(req.params.id).populate({
        path: "zarId",
        select: "name"
    });
    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
    })
});
exports.getComment = asyncHandler ( async ( req, res, next ) => {
    const comment = await CommentModel.findById(req.params.id);
    if(!comment){
        throw new MyError(req.params.id + " категорын ID шалгаж үзнэ үү? ", 401)
    }
    res.status(200).json({
        success: true,
        data: comment
    })
})
exports.updateComment = asyncHandler ( async (req, res, next) => {
    let comment = await CommentModel.findById(req.params.id);    
    if(!comment){
        throw new MyError(`${req.params.id} ийм коммэнт байхгүй байна. Та ID шалгана уу? `, 402);
    }
    if( comment.userId.toString() !== req.userId && req.userRole !== "admin"){
        throw new MyError("Та зөвхөн өөрийнхөө коммэнтыг засварлах эрхтэй", 403)
    }
    for(let att in req.body){
        comment[att] = req.body[att]
    };
    comment.save()
    
    res.status(200).json({
        success: true,
        data: comment
    })
});

exports.deleteComment = asyncHandler(async(req, res, next) => {
    const comment = await CommentModel.findById(req.params.id);
    if(!comment) {
        throw new MyError( req.params.id + " ID-тай коммэнт шалгана уу? Устгаж чадсангүй", 403)
    };

    if( comment.userId.toString() !== req.userId && req.userRole !== "admin"){
        throw new MyError("Та зөвхөн өөрийнхөө коммэнт устгах эрхтэй", 404)
    }
    comment.deleteOne();

    res.status(200).json({
        success: true,
        data: comment,
    })
})