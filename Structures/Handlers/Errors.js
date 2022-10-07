const { Client, EmbedBuilder } = require("discord.js")
const ChannelID = process.env.LOGS

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: "Anti-crash by Drago" })
        .setTitle("⚠ | Error Encountered")

    process.on("unhandledRejection", (reason, p) => {

        console.log(reason, p)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription("**Unhandled Rejection/Catch:\n\n** ```" + reason + "```")
            ]
        })

    })

    process.on("uncaughtException", (err, origin) => {

        console.log(err, origin)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription("**Uncaught Exception/Catch:\n\n** ```" + err + "\n\n" + origin.toString() + "```")
            ]
        })

    })

    process.on("uncaughtExceptionMonitor", (err, origin) => {

        console.log(err, origin)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription("**Uncaught Exception/Catch (MONITOR):\n\n** ```" + err + "\n\n" + origin.toString() + "```")
            ]
        })

    })

}