const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")
const AccountDB = require("../../Structures/Schemas/Account")

module.exports = {
    name: "deposit",
    description: "Deposits wallet money to the bank",
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

            if (Data.Wallet === 0) return Reply(interaction, "❌", `You don't have enough money!`, true)

            await interaction.deferReply()

            Data.Bank += Data.Wallet
            Data.Wallet = 0

            await Data.save()

            return EditReply(interaction, "✅", `All money has been deposited`)

        } else {

            const Converted = Number(Amount)

            if (isNaN(Converted) === true) return Reply(interaction, "❌", `The amount can only be a Number or \`all\`!`, true)
            if (Data.Wallet < parseInt(Converted) || Converted === Infinity) return Reply(interaction, "❌", `You don't have enough money!`, true)

            await interaction.deferReply()

            Data.Bank += parseInt(Converted)
            Data.Wallet -= parseInt(Converted)
            Data.Wallet = Math.abs(Data.Wallet)

            await Data.save()

            return EditReply(interaction, "✅", `Deposited ${parseInt(Converted)} to the bank`)

        }

    }
}