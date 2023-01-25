const { ChatInputCommandInteraction } = require("discord.js")
const DB = require("../../Structures/Schemas/Ticket")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "ticket",
    description: "Manages members inside an active ticket",
    UserPerms: ["ManageGuild"],
    BotPerms: ["ManageGuild"],
    category: "Community",
    options: [
        {
            name: "user",
            description: "Select a user to manage for this ticket",
            type: 6,
            required: true,
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { guildId, options, channel } = interaction

        const Member = options.getMember("user")

        const Data = await DB.findOne({ Guild: guildId, ChannelID: channel.id }).catch(err => { })
        if (!Data) return EditReply(interaction, "❌", `This channel is not tied with a ticket!`)

        if (Data.MembersID.includes(Member.id)) {

            Data.MembersID = Data.MembersID.filter(x => x !== Member.id)

            channel.permissionOverwrites.edit(Member.id, {
                "ViewChannel": false,
            })

            await Data.save()

            EditReply(interaction, "✅", `Successfully removed ${Member} from the ticket`)

        } else {

            Data.MembersID.push(Member.id)

            channel.permissionOverwrites.edit(Member.id, {
                "SendMessages": true,
                "ViewChannel": true,
                "ReadMessageHistory": true
            })

            await Data.save()

            EditReply(interaction, "✅", `Successfully added ${Member} to the ticket`)

        }

    }
}