const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const ShoptItems = require("../../Systems/Items")

module.exports = {
    name: "shop",
    description: "Shows all the shop items",
    category: "Economy",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply()

        const { } = interaction

        const Sorted = ShoptItems.sort((a, b) => a.price - b.price)

        const MappedData = Sorted.map(value => `\`${value.emoji}\` **${value.name}** - ${value.price}`).join("\n")

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTimestamp()
            .setTitle("Shop Items")
            .setDescription(`${MappedData}`)

        interaction.editReply({ embeds: [Embed] })

    }
}