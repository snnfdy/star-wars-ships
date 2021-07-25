const mongoose = require("mongoose");

const fighterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    age: Number,
    sex: String,
    email: String
});

module.exports = mongoose.model("Fighter", fighterSchema);