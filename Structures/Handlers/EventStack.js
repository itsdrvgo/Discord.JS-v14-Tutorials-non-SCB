const { Client } = require("discord.js")

/**
 * @param {Client} client
 */
module.exports = async(client, PG, Ascii) => {

    const EventFiles = await PG(`${process.cwd()}/EventStack/*.js`)
    EventFiles.map(value => require(value))

}