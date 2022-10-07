const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "role",
    description: "Give or remove role from a member or everyone",
    UserPerms: ["ManageRoles"],
    BotPerms: ["ManageRoles"],
    category: "Moderation",
    options: [
        {
            name: "options",
            description: "Select the option",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Give",
                    value: "give"
                },
                {
                    name: "Remove",
                    value: "remove"
                },
                {
                    name: "Give All",
                    value: "give-all"
                },
                {
                    name: "Remove All",
                    value: "remove-all"
                }
            ]
        },
        {
            name: "role",
            description: "Select the role to be managed",
            type: 8,
            required: true
        },
        {
            name: "user",
            description: "Select the user to manage roles",
            type: 6,
            required: false
        }
    ],

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild, member } = interaction

        const Options = options.getString("options")
        const Role = options.getRole("role")
        const Target = options.getMember("user") || member

        if (guild.members.me.roles.highest.position <= Role.position) return EditReply(interaction, "❌", `The role you're tying to manage for a member is higher than me!`)

        switch (Options) {

            case "give": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position) return EditReply(interaction, "❌", `The member you're tying to manage is higher than me in roles!`)

                if (Target.roles.cache.find(r => r.id === Role.id)) return EditReply(interaction, "❌", `${Target} already has the role, **${Role.name}**!`)

                await Target.roles.add(Role)

                EditReply(interaction, "✅", `${Target} now has the role **${Role.name}**`)

            }
                break;

            case "remove": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position) return EditReply(interaction, "❌", `The member you're tying to manage is higher than me in roles!`)

                if (!Target.roles.cache.find(r => r.id === Role.id)) return EditReply(interaction, "❌", `${Target} doesn't have the role, **${Role.name}**!`)

                await Target.roles.remove(Role)

                EditReply(interaction, "✅", `${Target} has lost the role **${Role.name}**`)

            }
                break;

            case "give-all": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, "✅", `Everyone has got the role, **${Role.name}**`)

                await Members.forEach(m => m.roles.add(Role))

            }
                break;

            case "remove-all": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, "✅", `Everyone has lost the role, **${Role.name}**`)

                await Members.forEach(m => m.roles.remove(Role))

            }
                break;


        }

    }
}