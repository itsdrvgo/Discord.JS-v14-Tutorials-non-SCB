const { Client, ButtonInteraction, ActionRowBuilder, InteractionType, ButtonStyle, ChannelType, EmbedBuilder, ButtonBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/Ticket")
const TicketSetupData = require("../../Structures/Schemas/TicketSetup")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { guild, customId, type, user, member } = interaction

        if (type !== InteractionType.MessageComponent) return
        if (customId !== "create-ticket") return

        await interaction.deferReply({ ephemeral: true })

        const TicketData = await DB.findOne({ Guild: guild.id, Type: user.id }).catch(err => { })
        if (TicketData) return EditReply(interaction, "❌", `You already have a ticket open, you can't create more!`)

        const Data = await TicketSetupData.findOne({ Guild: guild.id }).catch(err => { })
        if (!Data) return EditReply(interaction, "❌", `The ticket can't be created at this moment!`)

        const ID = Math.floor(Math.random() * 90000) + 10000
        const Handler = guild.roles.cache.get(Data.Handlers)

        const Channel = await guild.channels.create({
            name: `${user.tag + "-" + ID}`,
            type: ChannelType.GuildText,
            parent: Data.Category,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ["ViewChannel"]
                },
                {
                    id: Handler.id,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "EmbedLinks", "AddReactions"]
                },
                {
                    id: member.id,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "EmbedLinks", "AddReactions"]
                },
                {
                    id: client.user.id,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "EmbedLinks", "AddReactions"]
                },
            ],

        })

        await DB.create({
            Guild: guild.id,
            MembersID: member.id,
            TicketID: ID,
            ChannelID: Channel.id,
            Closed: false,
            Type: user.id,
            OpenTime: parseInt(Channel.createdTimestamp / 1000)
        })

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${guild.name} | Ticket: ${ID}`, iconURL: guild.iconURL() })
            .setDescription(`Please state your issue`)
            .setTimestamp()

        const Buttons = new ActionRowBuilder()
        Buttons.addComponents(

            new ButtonBuilder()
                .setCustomId("close")
                .setLabel("Save & Close Ticket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("❌")

        )

        Channel.send({ content: `${Handler}`, embeds: [Embed], components: [Buttons] })
        Channel.send({ content: `${member}, here is your ticket!` }).then((m) => {

            setTimeout(() => {

                m.delete().catch(() => { })

            }, 5000)

        })

        return EditReply(interaction, "✅", `${member}, your ticket has been created in ${Channel}`)

    }

}