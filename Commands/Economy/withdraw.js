const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")
const AccountDB = require("../../Structures/Schemas/Account")

module.exports = {
    name: "withdraw",
    description: "Withdraws bank money to the wallet",
    category: "Economy",
    options: [
        {
            name: "amount",
            description: "Specify the amount (use 'all' for all money)",
            required: true,
            type: 3
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { options, user } = interaction

        const Amount = options.getString("amount")

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account!`, true)

        if (Amount.toLowerCase() === "all") {

            if (Data.Bank === 0) return Reply(interaction, "❌", `You don't have enough money!`, true)

            await interaction.deferReply()

            Data.Wallet += Data.Bank
            Data.Bank = 0

            await Data.save()

            return EditReply(interaction, "✅", `All money has been withdrawn`)

        } else {

            const Converted = Number(Amount)

            if (isNaN(Converted) === true) return Reply(interaction, "❌", `The amount can only be a Number or \`all\`!`, true)
            if (Data.Bank < parseInt(Converted) || Converted === Infinity) return Reply(interaction, "❌", `You don't have enough money!`, true)

            await interaction.deferReply()

            Data.Wallet += parseInt(Converted)
            Data.Bank -= parseInt(Converted)
            Data.Bank = Math.abs(Data.Bank)

            await Data.save()

            return EditReply(interaction, "✅", `Withdrawn ${parseInt(Converted)} from the bank`)

        }

    }
}