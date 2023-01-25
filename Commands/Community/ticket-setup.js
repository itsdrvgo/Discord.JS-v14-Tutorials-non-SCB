const { EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js")
const DB = require("../../Structures/Schemas/TicketSetup")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "ticket-setup",
    description: "Creates a ticket and sends it to a specified channel",
    UserPerms: ["ManageGuild"],
    BotPerms: ["ManageGuild"],
    category: "Community",
    options: [
        {
            name: "channel",
            description: "Select the channel to send the ticket",
            required: true,
            type: 7,
            channelTypes: [ChannelType.GuildText]
        },
        {
            name: "category",
            description: "Select the catergory of the ticket channel where's it's gonna be created",
            required: true,
            type: 7,
            channelTypes: [ChannelType.GuildCategory]
        },
        {
            name: "transcripts",
            description: "Select the transcript channel for the ticket",
            required: true,
            type: 7,
            channelTypes: [ChannelType.GuildText]
        },
        {
            name: "handler",
            description: "Select the ticket handler's role",
            required: true,
            type: 8,
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { guild, options } = interaction

        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const Channel = options.getChannel("channel")
        const Category = options.getChannel("category")
        const Transcripts = options.getChannel("transcripts")
        const Handlers = options.getRole("handler")

        await DB.findOneAndUpdate(
            { Guild: guild.id },
            {
                Channel: Channel.id,
                Category: Category.id,
                Transcripts: Transcripts.id,
                Handlers: Handlers.id,
            },
            {
                new: true,
                upsert: true
            })

        const Buttons = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("create-ticket")
                .setLabel("Create Ticket")
                .setStyle(ButtonStyle.Primary)

        )

        Embed
            .setAuthor({ name: guild.name + " | Ticket System", iconURL: guild.iconURL() })
            .setDescription(`Click the button to create a ticket`)

        EditReply(interaction, "✅", `Sent the ticket to ${Channel}`)

        return Channel.send({
            embeds: [Embed],
            components: [Buttons]
        })

    }
}