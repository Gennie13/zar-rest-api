const { query } = require("express");
const mongoose = require("mongoose");
const CategoryModel = require("../models/categoryModel");
const ZarModel = require("../models/zarModel");
const CommentModel = require("../models/comment");
//aldaa tsatsah system-msj, code -
const MyError = require("../utils/myError")
const asyncHandler = require("express-async-handler");


    
exports.getCategories = asyncHandler ( async ( req, res, next ) => {
    //req.query-eer filder hiih
    const select = req.query.select;
    const sort = req.query.sort;
    ['select', 'sort'].forEach( el => delete req.query[el])
    
    const categories = await CategoryModel.find(req.query, select).sort(sort);
    res.status(200).json({
        success: true,
        count: categories.length,
        view: categories.view,
        data: categories,
    })
});
exports.createCategory = asyncHandler ( async (req, res, next) => {
    const category = await CategoryModel.create(req.body);
    if(!category){
        throw new MyError(req.body.category + " шалгаж үзнэ үү? ", 400)
    }
    req.body.createUser = req.userId;
    res.status(200).json({
        success: true,
        data: category,
    })
});
exports.getCategory = asyncHandler ( async ( req, res, next ) => {
    
    const category = await CategoryModel.findById(req.params.id).populate("zaruud");
    if(!category){
        throw new MyError(req.params.id + " категорын ID шалгаж үзнэ үү? ", 401)
    }
   
    //categoriig get hiisneer n tooloh
    category.watchCount += 1;
    category.save()
    
    res.status(200).json({
        success: true,
        // viewCount,
        data: category
    })
})
exports.updateCategory = asyncHandler(async(req, res, next) => {
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if(!category) {
        throw new MyError( req.params.id + " категорын ID шалгана уу? Засварлаж чадсангүй", 402)
    };
    const userName = await req.userName

    res.status(200).json({
        success: true,
        data: category,
        updateUser: userName
    })
})
exports.deleteCategory = asyncHandler(async(req, res, next) => {
    const reqId = req.params.id;
    const catDel = await CategoryModel.findByIdAndDelete(req.params.id);
    const zarDel = await ZarModel.find({category: req.params.id});
    const zarIds = await zarDel.map(item => item._id.toString());
    await ZarModel.deleteMany({ _id: { $in: zarIds } });
    const comDel = await CommentModel.deleteMany({zarId: { $in: zarIds }});

    res.status(200).json({
        success: true,
        deleteCat: catDel,
        deleteZar: zarDel,
        deleteComments: comDel
    })
})
