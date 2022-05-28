const Joi = require("joi");
const config = require("config");
const func = require("joi/lib/types/func");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        minlength: 5,
        maxlength:50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength:255

    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength:1024,
    },
    isAdmin: {
        type: Boolean
    }
});

userSchema.methods.generateAuthTokens = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(50).required().email(),
      password: Joi.string().min(5).max(50).required()
    };
  
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;