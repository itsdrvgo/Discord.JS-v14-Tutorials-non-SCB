const { EmbedBuilder } = require("discord.js")

function Reply(interaction, emoji, description, type) {

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`${emoji} | ${description}`)
        ],
        ephemeral: type
    })

}

module.exports = Reply