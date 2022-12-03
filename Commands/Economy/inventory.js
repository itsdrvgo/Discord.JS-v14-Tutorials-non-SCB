const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const ShoptItems = require("../../Systems/Items")
const AccountDB = require("../../Structures/Schemas/Account")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "inventory",
    description: "Shows all the inventory items",
    category: "Economy",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { user } = interaction

        const Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first!`, true)
        if (!Data.Inventory || Object.keys(Data.Inventory).length === 0) return Reply(interaction, "❌", `You've no item in your inventory!`, true)

        await interaction.deferReply()

        const inventory = Object.keys(Data.Inventory).sort()

        const MappedData = inventory.map(a => {

            const Item = ShoptItems.find(val => val.value === a)

            return `${Item.emoji} **${Item.name} -** ${Data.Inventory[Item.value]} | *ID* \`${Item.value}\``

        }).join("\n")

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTimestamp()
            .setAuthor({ name: `${user.username}'s Inventory` })
            .setDescription(`${MappedData}`)

        interaction.editReply({ embeds: [Embed] })

    }
}