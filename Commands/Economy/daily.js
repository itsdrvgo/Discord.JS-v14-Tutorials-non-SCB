const { Client, ChatInputCommandInteraction } = require("discord.js")
const ms = require("ms")
const AccountDB = require("../../Structures/Schemas/Account")
const ActionsDB = require("../../Structures/Schemas/MoneyActions")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "daily",
    description: "Claim your daily bonus",
    category: "Economy",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { user } = interaction

        let Data = await AccountDB.findOne({ User: user.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `Please create an account first!`, true)

        let AData = await ActionsDB.findOne({ User: user.id }).catch(err => { })

        if (!AData) {

            await interaction.deferReply()

            let Timeout = Date.now() + ms("1d")

            AData = new ActionsDB({
                User: user.id,
                Daily: Timeout
            })

            await AData.save()

            Collect()

        } else {

            if (AData.Daily > Date.now()) return Reply(interaction, "❌", `You've already collected your reward today, come back <t:${parseInt(AData.Daily / 1000)}:R>`, true)

            await interaction.deferReply()

            let Timeout = Date.now() + ms("1d")

            AData.Daily = Timeout
            await AData.save()

            Collect()

        }

        async function Collect() {

            const Amount = Math.ceil(Math.random() * 5000)

            Data.Wallet += Amount
            await Data.save()

            EditReply(interaction, "✅", `You've claimed $${Amount} as your daily reward`)

        }

    }
}