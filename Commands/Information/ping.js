const { Client, ChatInputCommandInteraction } = require("discord.js")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "ping",
    description: "Displays the ping",
    category: "Information",
    premium: true,

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        return Reply(interaction, "⏳", `The current Websocket Latency is : \`${client.ws.ping} ms\``, false)

    }
}