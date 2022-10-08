const { Client, Partials, Collection } = require("discord.js")
const ms = require("ms")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
require("dotenv").config()
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials
const nodes = require("../Systems/Nodes")
const { Manager } = require("erela.js")

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "roles", "users"] },
    rest: { timeout: ms("1m") }
})

client.color = "Blue"
client.commands = new Collection()

const { DiscordTogether } = require("discord-together")
client.discordTogether = new DiscordTogether(client)

client.player = new Manager({
    nodes,
    send: (id, payload) => {

        let guild = client.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)

    }
})

client.on("raw", (d) => client.player.updateVoiceState(d))

const Handlers = ["Events", "Commands", "EventStack", "Errors", "Player"]

Handlers.forEach(handler => {

    require(`./Handlers/${handler}`)(client, PG, Ascii)

})

module.exports = client

client.login(process.env.TOKEN)