const { model, Schema } = require("mongoose")

module.exports = model("ticket", new Schema({

    Guild: String,
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Type: String,
    OpenTime: String

}))