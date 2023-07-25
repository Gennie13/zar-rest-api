const mongoose = require("mongoose");
const {slugify} = require("transliteration");
const zarModel = require("./zarModel");


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Зарын категорийн нэрийг заавал оруулна уу?"],
        maxlength: [50, "Категорийн нэрийн урт 50-аас ихгүй байна!"],
        unique: true,
        trim: true
    },
    nameSlugify: String,
    uploadPhoto: {
        type: String,
        default: "no-photo.jpg"
    },
    averagePrice: Number,

},
{toJSON:{virtuals:true}, toObject:{virtuals: true}}
);
//save hiihin umnu modeliin nameSlugify talbariig duurgeh
CategorySchema.pre("save", function(next){
    this.nameSlugify = slugify(this.name);
    this.averagePrice = Math.floor(Math.random() * 100000) + 10000;
    next()
});

// CategorySchema.pre("deleteMany", { document: false, query: true }, async function(next){
//     const test =  await mongoose.model(zarModel).deleteMany({ category: this._conditions._id })
//     console.log("aldaa  - ------> "+test)
//     next()
// } )

CategorySchema.methods.getViewCount = function() {
    let viewCount = "0";
    return viewCount++
}

CategorySchema.virtual("zaruud",{
    ref: "Zaruud",
    //category derh dotood tulhuur
    localField: "_id",
    foreignField: "category",
    justOne:  false
});
module.exports = mongoose.model("Category", CategorySchema);