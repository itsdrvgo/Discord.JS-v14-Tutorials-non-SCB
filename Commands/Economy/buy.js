const { Client, ChatInputCommandInteraction } = require("discord.js")
const ShoptItems = require("../../Systems/Items")
const AccountDB = require("../../Structures/Schemas/Account")
const Reply = require("../../Systems/Reply")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "buy",
    description: "Buys item from the shop",
    category: "Economy",
    options: [
        {
            name: "item-name",
            description: "Provide the name",
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

        const ItemName = options.getString("item-name").toLowerCase()
        const Quantity = options.getInteger("quantity") || 1

        const validItem = ShoptItems.find(val => val.name.toLowerCase() === ItemName)
        if (!validItem) return Reply(interaction, "❌", `This is not a valid item!`, true)

        const Price = validItem.price * Quantity

        if (Data.Wallet < Price) return Reply(interaction, "❌", `You don't have enough balance!`, true)

        await interaction.deferReply()

        if (!Data.Inventory) Data.Inventory = {}
        await Data.save()

        if (!Object.keys(Data.Inventory).includes(validItem.value)) Data.Inventory[validItem.value] = Quantity
        else Data.Inventory[validItem.value] += Quantity

        await AccountDB.findOneAndUpdate({ User: user.id }, Data)

        Data.Wallet -= Price
        Data.Wallet = Math.abs(Data.Wallet)
        await Data.save()

        return EditReply(interaction, "✔", `${user} bought ${Quantity}x **${validItem.name}** from store`)

    }
}