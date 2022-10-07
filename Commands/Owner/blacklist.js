const { Client, ChatInputCommandInteraction } = require("discord.js")
const DBG = require("../../Structures/Schemas/BlacklistG")
const DBU = require("../../Structures/Schemas/BlacklistU")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "blacklist",
    description: "Blacklists a server or member from using the bot",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Owner",
    options: [
        {
            name: "options",
            description: "Choose an option",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Server",
                    value: "server"
                },
                {
                    name: "Member",
                    value: "member"
                }
            ]
        },
        {
            name: "id",
            description: "Provide the ID of the user or the server",
            type: 3,
            required: true
        },
        {
            name: "reason",
            description: "Provide a reason",
            type: 3,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { user, options } = interaction

        if (user.id !== "536238813119381524") return EditReply(interaction, "❌", `This command is classified!`)

        const Options = options.getString("options")
        const ID = options.getString("id")
        const Reason = options.getString("reason") || "no reason provided"

        if (isNaN(ID)) return EditReply(interaction, "❌", `The ID is supposed to be a number!`)

        switch (Options) {

            case "server": {

                const Guild = client.guilds.cache.get(ID)

                let GName
                let GID

                if (Guild) {

                    GName = Guild.name
                    GID = Guild.id

                } else {

                    GName = "Unknown"
                    GID = ID

                }

                let Data = await DBG.findOne({ Guild: GID }).catch(err => { })

                if (!Data) {

                    Data = new DBG({
                        Guild: GID,
                        Reason,
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, "✅", `Successfully added **${GName} (${GID})** in blacklisted servers, for the reason: **${Reason}**`)

                } else {

                    await Data.delete()

                    EditReply(interaction, "✅", `Successfully removed **${GName} (${GID})** from the blacklisted servers`)

                }

            }
                break;

            case "member": {

                let Member
                let MName
                let MID

                const User = client.users.cache.get(ID)

                if (User) {

                    Member = User
                    MName = User.tag
                    MID = User.id

                } else {

                    Member = "Unknown User #0000"
                    MName = "Unknown User #0000"
                    MID = ID

                }


                let Data = await DBU.findOne({ User: MID }).catch(err => console.log(err))

                if (!Data) {

                    Data = new DBU({
                        User: MID,
                        Reason,
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, "✅", `Successfully added **${Member} (${MName} | ${MID})** in blacklisted members, for the reason: **${Reason}**`)

                } else {

                    await Data.delete()

                    EditReply(interaction, "✅", `Successfully removed **${Member} (${MName} | ${MID})** from the blacklisted members`)

                }

            }
                break;

        }

    }
}