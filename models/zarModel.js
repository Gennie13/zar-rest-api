const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {transliterate} = require("transliteration");
const CategoryModel = require("./categoryModel");

// const UserModel;

const ZarShema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Зарын нэрийг оруулна уу?"],
        maxlength: [100, "Зарын нэр хамгийн уртдаа 100 байна"]
    },
    nameTr: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        //holboootoi document
        ref: 'Category',
        required : true
    },
    createUser: {
        type: mongoose.Schema.Types.ObjectId,
        //holboootoi document
        ref: 'User'
    },
    updateUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    deleteUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    mongoldeseh: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
        required: true
    },
    uploadPhoto: {
        type: String,
        required: true,
        default: "no-photo.jpg",
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: [true, "Зарын үнийг оруулна уу?"],
    },
    newOrSecond: {
        type: String,
        default: "second",
    }, 
    phoneNumber: {
        type: Number,
        required: true,
        maxlength: 11,
        minlength: 8,
    },
    tailbar: {
        type: String,
        required: [true, "Зарын тайлбарийг оруулна уу?"],
        maxlength: [500, "Зарын тайлбар хамгийн уртдаа 500 байна"]
    },
},{
    toJSON: {virtuals: true}, toObject:{virtuals: true}
});
//zariig uuseh uyd n neg categoriin zariig hamt duudna
ZarShema.virtual("busad-zaruud", {
    ref: "Zaruud",
    foreignField: "category",
    localField: "category",
    justOne: false
});


ZarShema.pre("save", function(next){
    this.nameTr = transliterate(this.name);
    next()
});

// ZarShema.pre("deleteMany", function(next){
//     return mongoose.model("ZarShema", Zaruud).deleteMany({category:this._id})
// })

module.exports = mongoose.model("Zaruud", ZarShema);
