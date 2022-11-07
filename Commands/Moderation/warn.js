const { Client, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js')
const DB = require('../../Structures/Schemas/Warnings')
const EditReply = require('../../Systems/EditReply')
const Pagination = require("../../Systems/Pagination")
const Reply = require('../../Systems/Reply')

module.exports = {
    name: "warn",
    description: "Add, remove or check warns of a member",
    UserPerms: ["ManageRoles"],
    category: "Moderation",
    options: [
        {
            name: "add",
            description: "Adds warn to a member",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Select the user to be warned",
                    type: 6,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Provide the reason for the warn",
                    type: 3,
                    required: false,
                },
            ]
        },
        {
            name: "remove",
            description: "Removes warn from a member",
            type: 1,
            options: [
                {
                    name: "warn-id",
                    description: "Provide a member's Warn ID",
                    type: 3,
                    required: true,
                },
            ]
        },
        {
            name: "list",
            description: "Displays all the warnings of a member",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Select the warned user to be displayed",
                    type: 6,
                    required: true,
                },
            ]
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { options, user, channel, guild } = interaction

        const Sub = options.getSubcommand()

        switch (Sub) {

            case "add": {

                const member = options.getMember("user")
                const reason = options.getString("reason") || "no reason provided"

                const Member = guild.members.cache.get(member.id)

                if (Member.id === user.id) return Reply(interaction, process.env.Cross, `You can't warn yourself!`, true)
                if (guild.ownerId === Member.id) return Reply(interaction, process.env.Cross, `You can't warn the server's owner!`, true)

                await interaction.deferReply()

                let Data = new DB({

                    User: Member.id,
                    Guild: guild.id,
                    Moderator: user.id,
                    Reason: reason,
                    Timestamp: Date.now()

                })

                await Data.save()

                EditReply(interaction, process.env.Tick, `${Member} has been warned for: **${reason}**`)

                Member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${process.env.Warning} | You have been Warned!`)
                            .setColor(client.color)
                            .setThumbnail(Member.displayAvatarURL())
                            .addFields(
                                { name: "Name:", value: `${Member.user.tag}`, inline: true },
                                { name: "Warned in:", value: `${guild.name}`, inline: true },
                                { name: "Reason:", value: `${reason}`, inline: false },
                            )
                            .setFooter({ text: "Warned by Drago" })
                            .setTimestamp()
                    ]
                }).catch((err) => {

                    if (err.code !== 50007) return console.log(err)

                })

            }
                break;

            case "remove": {

                await interaction.deferReply({ ephemeral: true })

                const warnid = options.getString("warn-id")

                const data = await DB.findOne({ _id: warnid }).catch(err => { })
                if (!data) return EditReply(interaction, process.env.Cross, `The ID you provided is not a valid ID!`)

                const member = guild.members.cache.get(data.User)

                await data.delete()

                EditReply(interaction, process.env.Tick, `Removed \`1\` warning from **${member}**`)

            }
                break;

            case "list": {

                const member = options.getMember("user")
                if (!member) return Reply(interaction, process.env.Cross, `The member couldn't be found!`)
                const Member = guild.members.cache.get(member.id)

                const userWarns = await DB.find({ User: Member.id, Guild: guild.id }).catch(err => { })
                if (userWarns.length === 0) return Reply(interaction, process.env.Cross, `**${Member}** does not have any warnings!`)

                const embeds = warnlistEmbed(userWarns, 5, guild, Member, client)
                Pagination(interaction, embeds, user)

            }
                break;

        }

    }
}

function warnlistEmbed(pages, number, guild, Member, client) {

    const Embeds = []
    let k = number

    for (let i = 0; i < pages.length; i += number) {

        const current = pages.slice(i, k)

        k += number

        const MappedData = current.map(warn => {

            const moderator = guild.members.cache.get(warn.Moderator)

            const inSeconds = warn.Timestamp / 1000
            const Time = inSeconds.toString().split(".")

            return [
                `**Warn ID:** \`${warn._id}\``,
                `**Moderator:** ${moderator || "Unknown User#0000"}`,
                `**Date:** <t:${Time[0]}:R>`,
                `**Reason:** ${warn.Reason}`
            ].join("\n")

        }).join("\n\n")

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(Member.displayAvatarURL())
            .setTitle(`${Member.user.tag}'s Warnings`)
            .setDescription(`${MappedData}`)
            .setFooter({ text: 'Warnings by Drago' })
            .setTimestamp()

        Embeds.push(Embed)

    }

    return Embeds

}