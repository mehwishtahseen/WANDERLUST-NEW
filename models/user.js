const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

// passport-local-mongoose will automatically define username
// and will also do hashing & salting so we need not to do them from scratch

module.exports = mongoose.model("User", userSchema);
