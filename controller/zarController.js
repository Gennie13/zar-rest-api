//aldaa tsatsah system-msj, code -
const { query } = require("express");
const MyError = require("../utils/myError")
const asyncHandler = require("express-async-handler");
const ZarModel = require("../models/zarModel");
const UserModel = require("../models/user");
const CommentsModel = require("../models/comment");
const CategoryModel = require("../models/categoryModel");
const {Logger} = require("../middleware/logger");


exports.getZaruud = asyncHandler ( async ( req, res, next ) => {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    ['page', 'limit'].forEach( el => delete req.query[el]);
   
    const total = await ZarModel.countDocuments();
    const pageCount = Math.ceil( total / limit );
    const start = ( page - 1 ) * limit + 1;
    let end = start + limit - 1;
    if(end > total ) end = total;

    const pagination = {total, pageCount, start, end};

    if(page < pageCount) pagination.nextPage = page + 1;
    if(page > 1) pagination.prevPage = page - 1;

    const zaruud = await ZarModel.find(req.query).skip(start-1).limit(limit).populate({
        path: "category",
        select: "name"
    });
    res.status(200).json({
        success: true,
        count: zaruud.length,
        data: zaruud,
        pagination
    })
});
exports.createZar = asyncHandler ( async (req, res, next) => {
    const category = await CategoryModel.findById(req.body.category)
    if(!category){
        throw new MyError(`${category} ийм категори ID  байхгүй байна. Та ID шалгана уу? `, 400);
    }
    req.body.createUser = req.userId;
    const zar = await ZarModel.create(req.body);

    res.status(200).json({
        success: true,
        data: zar
    })
});
exports.getZar = asyncHandler ( async ( req, res, next ) => {
    let zar = await ZarModel.findById(req.params.id).populate("busad-zaruud");
    if(!zar){
        throw new MyError(req.params.id + " категорын ID шалгаж үзнэ үү? ", 401)
    }
    zar.watchCount += 1;
    zar.save()

    
    res.status(200).json({
        success: true,
        data: zar
    })
})

exports.updateZar = asyncHandler(async(req, res, next) => {

    const zar = await ZarModel.findById(req.params.id);
    
    if(!zar) {
        throw new MyError( req.params.id + " категорын ID шалгана уу? Засварлаж чадсангүй", 402)
    };
    
    if( zar.createUser.toString() !== req.userId && req.userRole !== "admin"){
        throw new MyError("Та зөвхөн өөрийнхөө номыг засварлах эрхтэй", 403)
    }
    req.body.updateUser = req.userId;
    // const zar = await ZarModel.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true,
    // });
    for(let att in req.body){
        zar[att] = req.body[att]
    };
    zar.save();
    res.status(200).json({
        success: true,
        data: zar
    })
})
exports.deleteZar = asyncHandler(async(req, res, next) => {
    // console.log(req.params.id)
    req.body.deleteUser = req.userId;
    const zar = await ZarModel.findById(req.params.id);
    if(!zar) {
        throw new MyError( req.params.id + " категорын ID шалгана уу? Устгаж чадсангүй", 403)
    };

    if( zar.createUser.toString() !== req.userId && req.userRole !== "admin"){
        throw new MyError("Та зөвхөн өөрийнхөө номыг устгах эрхтэй", 404)
    }
    
    zar.deleteOne();

    const zarComments = await CommentsModel.find({zarId: req.params.id}).deleteMany();

    res.status(200).json({
        success: true,
        deleteZar: zar,
        deleteComments: zarComments
    })
})





//  /zaruud/:zarId/comments
exports.getZarComments = asyncHandler ( async ( req, res, next ) => {
    const zar = await ZarModel.findById(req.params.id).populate({
        path: "comments",
        select: "comment createdAt"
    });
    console.log(zar.comments)
    if(!zar){
        throw new MyError(req.params.id + " категорын ID шалгаж үзнэ үү? ", 401)
    }
    res.status(200).json({
        success: true,
        data: zar
    })
})