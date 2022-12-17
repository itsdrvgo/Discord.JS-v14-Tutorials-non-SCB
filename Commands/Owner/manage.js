const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const axios = require("axios")

module.exports = {
    name: "manage",
    description: "Manages the host's power state",
    category: "Owner",
    options: [
        {
            name: "process",
            description: "Choose the process",
            required: true,
            type: 3,
            choices: [
                { name: "Start", value: "start" },
                { name: "Stop", value: "stop" },
                { name: "Restart", value: "restart" },
                { name: "Kill", value: "kill" }
            ]
        }
    ],

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options } = interaction

        const Process = options.getString("process")
        const serverName = "Prime"
        const Server = "37c86ec8"

        axios({

            url: `https://panel.purplefoxhost.com/api/client/servers/${Server}/power`,
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SERVER_API}`
            },
            data: {
                signal: Process
            }

        }).then(res => {

            EditReply(interaction, "✅", `Successfully triggered **${serverName}**'s power state, \`${Process.toUpperCase()}\``)

        }).catch(err => {

            EditReply(interaction, "❌", `Couldn't trigger the power state of **${serverName}**, \`${Process.toUpperCase()}\``)

        })

    }
}