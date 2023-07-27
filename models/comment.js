const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({ 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    zarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zaruud',
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: [500, "Тайлбар хамгийн уртдаа 500 байна"],
        set: comment => comment.toLowerCase()
    },
    createdAt:{
        type: Date,
        default: Date.now
    },

});



// CommentSchema.pre("save", function(next){
//     this.userId = 
//     this.nameSlugify = slugify(this.name);
//     this.averagePrice = Math.floor(Math.random() * 100000) + 10000;
//     next()
// });

module.exports = mongoose.model("Comment", CommentSchema);