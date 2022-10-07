const { Client, GuildBan, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
    name: "guildBanAdd",

    /**
     * @param {GuildBan} guildBan
     * @param {Client} client
     */
    async execute(guildBan, client) {

        const { guild, user, reason } = guildBan
        const { id, username, discriminator } = user

        const data = await DB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.MemberBan === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`${process.env.Settings} | User Banned`)
                    .setDescription(`**${username}#${discriminator}** (${id}) has been banned from the server`)
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Drago" })
                    .setTimestamp()
            ]
        })

    }
}