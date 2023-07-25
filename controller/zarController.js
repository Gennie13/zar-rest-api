//aldaa tsatsah system-msj, code -
const { query } = require("express");
const MyError = require("../utils/myError")
const asyncHandler = require("express-async-handler");
const ZarModel = require("../models/zarModel");
const userModel = require("../models/user");
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
    const zar = await ZarModel.findById(req.params.id).populate("busad-zaruud");
    if(!zar){
        throw new MyError(req.params.id + " категорын ID шалгаж үзнэ үү? ", 401)
    }
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
    req.body.deleteUser = req.userId;
    const zar = await ZarModel.findById(req.params.id);
    if(!zar) {
        throw new MyError( req.params.id + " категорын ID шалгана уу? Устгаж чадсангүй", 403)
    };

    if( zar.createUser.toString() !== req.userId && req.userRole !== "admin"){
        throw new MyError("Та зөвхөн өөрийнхөө номыг устгах эрхтэй", 404)
    }
    zar.deleteOne();

    res.status(200).json({
        success: true,
        data: zar,
    })
})

//   /:categoryId/zaruud
exports.getCatZaruud = asyncHandler ( async ( req, res, next ) => {
    let query;
    const select = req.query.select;
    const sort = req.query.sort;
    ['select', 'sort'].forEach( el => delete req.query[el])

    if(req.params.categoryId) {
        query = ZarModel.find({category: req.params.categoryId}).populate({
            path: "category",
            select: "name"
        });
    }
    
    const zaruud = await query;
    res.status(200).json({
        success: true,
        count: zaruud.length,
        data: zaruud,
    })
});

// /users/:createUserId/zaruud
// ????????????????????????????????????????????????????????????????????
//neg herelegchiin uusgesen zaruudig harah
exports.getUserZaruud = asyncHandler ( async ( req, res, next ) => {
    req.query.createUser = req.userId
    const userZar = await ZarModel.find(req.query).populate({
        path: "category"
    })
    console.log(userZar)
    // req.query.createUser = await req.userId;
    // console.log(req.query+"------->zarcontroller");
    // const zaruud = await ZarModel.find(req.query);
    res.status(200).json({
        success: true,
        count: userZar.length,
        data: userZar
    })
});