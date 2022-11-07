const { Client, ChatInputCommandInteraction } = require("discord.js")
const DB = require("../../Structures/Schemas/PremiumGuild")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "premium-guild",
    description: "Manages premium system for a guild",
    UserPerms: ["Administrator"],
    category: "Owner",
    options: [
        {
            name: "add",
            description: "Adds premium system to a guild",
            type: 1,
            options: [
                {
                    name: "guild-id",
                    description: "Enter the guild id",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Removes premium system to a guild",
            type: 1,
            options: [
                {
                    name: "guild-id",
                    description: "Enter the guild id",
                    type: 3,
                    required: true
                }
            ]
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild } = interaction

        const Sub = options.getSubcommand()

        switch (Sub) {

            case "add": {

                const Target = options.getString("guild-id")
                if (!client.guilds.cache.has(Target)) return EditReply(interaction, "❌", `This guild doesn't exist in client cache!`)

                let Data = await DB.findOne({ Guild: Target }).catch(err => { })
                if (Data) return EditReply(interaction, "❌", `This guild is already a premium guild!`)

                Data = new DB({
                    Guild: Target
                })

                await Data.save()

                EditReply(interaction, "✅", `${client.guilds.cache.get(Target).name} is now a premium guild`)

            }
                break;

            case "remove": {

                const Target = options.getString("guild-id")
                if (!client.guilds.cache.has(Target)) return EditReply(interaction, "❌", `This guild doesn't exist in client cache!`)

                let Data = await DB.findOne({ Guild: Target }).catch(err => { })
                if (!Data) return EditReply(interaction, "❌", `This guild is not a premium guild!`)

                await Data.delete()

                EditReply(interaction, "✅", `${client.guilds.cache.get(Target).name} is not a premium guild anymore`)

            }
                break;

        }

    }
}