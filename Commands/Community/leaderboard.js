const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const Reply = require("../../Systems/Reply")
const levelDB = require("../../Structures/Schemas/Level")

module.exports = {
    name: "leaderboard",
    description: "Shows the leaderboard",
    category: "Community",

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { guild } = interaction

        let text = ""

        const Data = await levelDB.find({ Guild: guild.id })
            .sort({
                XP: -1,
                Level: -1
            })
            .limit(10)
            .catch(err => { })

        if (!Data) return Reply(interaction, "❌", "No one's at the leaderboard!")

        await interaction.deferReply()

        for (let counter = 0; counter < Data.length; ++counter) {

            const { User, XP, Level = 0 } = Data[counter]

            const Member = guild.members.cache.get(User)

            let MemberTag

            if (Member) MemberTag = Member.user.tag
            else MemberTag = "Unknown"

            let shortXp = shorten(XP)

            text += `${counter + 1}. ${MemberTag} | XP: ${shortXp} | Level: ${Level}\n`

        }

        interaction.editReply({

            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`\`\`\`${text}\`\`\``)
            ]

        })

    }
}

function shorten(count) {

    const ABBRS = ["", "k", "M", "T"]

    const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000))

    let result = parseFloat((count / Math.pow(1000, i)).toFixed(2))
    result += `${ABBRS[i]}`

    return result

}