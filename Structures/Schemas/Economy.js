const { model, Schema } = require("mongoose")

module.exports = model("economy", new Schema({

    User: String,
    Wallet: Number,

}))