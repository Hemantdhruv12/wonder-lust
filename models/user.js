const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// The fix ensures this line receives a function
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
