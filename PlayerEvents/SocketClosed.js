const { Client } = require("discord.js")
const { Player } = require("erela.js")

module.exports = {
    name: "socketClosed",

    /**
     * @param {Player} player
     * @param {WebSocket} payload
     * @param {Client} client 
     */
    async execute(player, payload, client) {

        await player.destroy()

    }
}