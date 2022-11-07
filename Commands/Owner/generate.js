const { Client, ChatInputCommandInteraction } = require("discord.js")
const VoucherDB = require("../../Structures/Schemas/Voucher")
const { generate } = require("voucher-code-generator")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "generate",
    description: "Generates a voucher code",
    category: "Owner",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { guild, options, user } = interaction

        let Data = await VoucherDB.findOne({ User: user.id }).catch(err => { })

        const code = generate({
            length: 8,
            count: 1
        })

        const generatedForThirty = code[0]

        if(!Data) {

            Data = new VoucherDB({
                User: user.id,
                ThirtyDay: generatedForThirty,
            })

            await Data.save()

            EditReply(interaction, "✅", `Generate new code with : ${generatedForThirty}`)

        } else {

            Data.ThirtyDay = generatedForThirty
            await Data.save()

            EditReply(interaction, "✅", `Generate new code with : ${generatedForThirty}`)

        }

    }
}