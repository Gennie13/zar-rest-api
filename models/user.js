const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ZarModel = require("./zarModel");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Хэрэглэгчийн нэрийг оруулна уу?"]
    },
    email: {
        type: String,
        required: [true, "Хэрэглэгчийн имэйл хаягийгй оруулж өгнө үү?"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Имэйл хаяг буруу байна"]
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        length: 4,
        required: [true, "Нууц үгээ оруулна уу?"],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type: Date,
        default: Date.now
    },

},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

UserSchema.virtual("Zaruud", {
    ref: "Zaruud",
    foreignField: "createUser",
    localField: "_id",
    justOne: false
})

//password + salt
UserSchema.pre("save", async function(next){
    if(!this.isModified('password')) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//token + jsonwebtoken
UserSchema.methods.getJsonWebToken = function () {
    const token = jwt.sign({
        id: this._id,
        name: this.name, 
        role: this.role
        } , process.env.JWT_SALT, {
        expiresIn: process.env.JWT_EXPIRESIN,
    });
    return token
};

UserSchema.methods.checkPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};
UserSchema.methods.changePassToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10*60*1000;
    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);