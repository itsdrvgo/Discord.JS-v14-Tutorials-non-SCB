const { ButtonInteraction, EmbedBuilder, Client, InteractionType } = require("discord.js")
const { createTranscript, ExportReturnType } = require("discord-html-transcripts")
const DB = require("../../Structures/Schemas/Ticket")
const TicketSetupData = require("../../Structures/Schemas/TicketSetup")
const ms = require("ms")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { guild, customId, channel, member, type } = interaction

        if (type !== InteractionType.MessageComponent) return
        if (customId !== "close") return

        const TicketData = await TicketSetupData.findOne({ Guild: guild.id }).catch(err => { })
        if (!TicketData) return Reply(interaction, "❌", `The data for the ticket is outdated!`, true)
        if (!member.roles.cache.find((r) => r.id === TicketData.Handlers)) return Reply(interaction, "❌", `You're not allowed to use these buttons!`, true)

        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const Data = await DB.findOne({ ChannelID: channel.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `No data was found related to this ticket, please delete manually!`, true)

        if (Data.Closed === true) return Reply(interaction, "❌", `The ticket is already closed, please wait for it to get deleted!`, true)

        await interaction.deferReply()

        const attachment = await createTranscript(channel, {
            limit: -1,
            returnType: ExportReturnType.Attachment,
            fileName: `${Data.Type} | ${Data.TicketID}.html`
        })

        await DB.updateOne({ ChannelID: channel.id }, { Closed: true })

        const TranscriptChannel = guild.channels.cache.get(TicketData.Transcripts)

        const Message = await TranscriptChannel.send({
            embeds: [
                Embed
                    .setTitle(`🎟 | Transcript`)
                    .addFields([
                        { name: "Ticket ID", value: `${Data.TicketID}`, inline: true },
                        { name: "Type", value: `${Data.Type}`, inline: true },
                        { name: "Opened By", value: `<@!${Data.MembersID[0]}>`, inline: true },
                        { name: "Open Time", value: `<t:${Data.OpenTime}:R>`, inline: true },
                        { name: "Close Time", value: `<t:${parseInt(Date.now() / 1000)}:R>`, inline: true },
                    ])
            ],
            files: [attachment]
        })

        EditReply(interaction, "✅", `The transcript is now saved as [TRANSCRIPT](${Message.url})`)

        setTimeout(async () => {

            channel.delete()
            await Data.delete()

        }, ms("10s"))

    }
}