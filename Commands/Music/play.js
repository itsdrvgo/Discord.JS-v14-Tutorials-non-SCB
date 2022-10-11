const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "play",
    description: "Plays a song",
    BotPerms: ["Connect", "Speak"],
    category: "Music",
    options: [
        {
            name: "query",
            description: "Provide song name or URL",
            type: 3,
            required: true
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild, member, channel, user } = interaction

        const query = options.getString("query")

        const Erela = client.player
        let res

        const VC = member.voice.channel
        if (!VC) return EditReply(interaction, "❌", `You need to be in a VC!`)

        if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return EditReply(interaction, "❌", `You've to be in a same channel as me to play a song!`)

        const player = Erela.create({
            guild: guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: channel.id,
            selfDeafen: true
        })

        if (player.state !== "CONNECTED") await player.connect()

        try {

            res = await player.search(query, user)

            if (res.loadType === "LOAD_FAILED") {

                if (!player.queue.current) player.destroy()
                return EditReply(interaction, "❌", `An error occured!`)

            } else if (res.loadType === "NO_MATCHES") {

                if (!player.queue.current) player.destroy()
                return EditReply(interaction, "❌", `No result was found!`)

            } else if (res.loadType === "PLAYLIST_LOADED") {

                player.queue.add(res.tracks)
                if (!player.playing && !player.paused && !player.queue.size) await player.play()

                return EditReply(interaction, "🎵", `Request received`)

            } else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {

                player.queue.add(res.tracks[0])
                if (!player.playing && !player.paused && !player.queue.size) await player.play()

                return EditReply(interaction, "🎵", `Request received`)

            }

        } catch (error) {
            console.log(error)
        }

    }
}