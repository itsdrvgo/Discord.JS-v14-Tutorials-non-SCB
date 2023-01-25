const { model, Schema } = require("mongoose")

module.exports = model("ticketsetup", new Schema({

    Guild: String,
    Channel: String,
    Category: String,
    Transcripts: String,
    Handlers: String,

}))