const mongoose = require("mongoose");

const fighterSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    age: Number,
    sex: String,
    email: {type: String, unique: true},
    ship: String,
    url: String,
    password: String,
    confirmed: {type: Boolean, defaultValue: false},
    confirmToken: String,
    token: String
});

module.exports = mongoose.model("Fighter", fighterSchema);