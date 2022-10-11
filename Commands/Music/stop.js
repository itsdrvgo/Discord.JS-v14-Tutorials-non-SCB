const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "stop",
    description: "Stops a song",
    category: "Music",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { guild, member } = interaction

        const Manager = client.player
        const player = Manager.players.get(guild.id)
        if (!player) return Reply(interaction, "❌", `No player is here!`, true)

        const VC = member.voice.channel
        if (!VC) return Reply(interaction, "❌", `You need to be in a VC!`, true)

        if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return Reply(interaction, "❌", `You've to be in a same channel as me to play a song!`, true)

        await interaction.deferReply()

        await player.destroy()

        EditReply(interaction, "🎵", `The player has been stopped`)

    }
}