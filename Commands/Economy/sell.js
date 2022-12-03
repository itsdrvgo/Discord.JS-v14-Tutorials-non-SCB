const { Client, ChatInputCommandInteraction } = require("discord.js")
const ShoptItems = require("../../Systems/Items")
const AccountDB = require("../../Structures/Schemas/Account")
const Reply = require("../../Systems/Reply")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "sell",
    description: "Sells item from the inventory",
    category: "Economy",
    options: [
        {
            name: "item-id",
            description: "Provide the id",
            type: 3,
            required: true
        },
        {
            name: "quantity",
            description: "Provide the quantity",
            type: 4,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { options, user } = interaction

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first!`, true)

        const ItemName = options.getString("item-id").toLowerCase()
        const Quantity = options.getInteger("quantity") || 1

        const validItem = ShoptItems.find(val => val.name.toLowerCase() === ItemName)
        if (!validItem) return Reply(interaction, "❌", `This is not a valid item!`, true)

        const Amount = Math.ceil(Math.random() * 3000) * Quantity

        if (Object.keys(Data.Inventory).length === 0) return Reply(interaction, "❌", `There's no item in the inventory!`, true)
        if (!Object.keys(Data.Inventory).includes(validItem.value)) return Reply(interaction, "❌", `You don't have this item in inventory!`, true)
        if (Data.Inventory[validItem.value] === 0) return Reply(interaction, "❌", `You don't have this item in inventory!`, true)
        if (Data.Inventory[validItem.value] < Quantity) return Reply(interaction, "❌", `You only have ${Data.Inventory[validItem.value]}x n your inventory!`, true)

        await interaction.deferReply()

        if (!Data.Inventory) Data.Inventory = {}
        await Data.save()

        Data.Inventory[validItem.value] -= Quantity
        Data.Inventory[validItem.value] = Math.abs(Data.Inventory[validItem.value])

        await AccountDB.findOneAndUpdate({ User: user.id }, Data)

        Data.Wallet += Amount
        await Data.save()

        return EditReply(interaction, "✔", `${user} sold ${Quantity}x **${validItem.name}** from inventory`)

    }
}