const { Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "announce",
    description: "Announces a message",
    UserPerms: ["ManageGuild"],
    BotPerms: ["ManageGuild"],
    category: "Utility",

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { } = interaction

        const modal = new ModalBuilder()
            .setCustomId("announce-modal")
            .setTitle("Annoucement")

        const messageInput = new TextInputBuilder()
            .setCustomId("message-input")
            .setLabel("Message")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Enter the announcement message")
            .setRequired(true)

        const Row = new ActionRowBuilder().addComponents(messageInput)

        modal.addComponents(Row)

        await interaction.showModal(modal)

    }
}