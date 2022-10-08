const { Client } = require("discord.js")
const { Node } = require("erela.js")
const { message } = new Error()

module.exports = {
    name: "nodeError",

    /**
     * @param {message} error
     * @param {Node} node
     * @param {Client} client 
     */
    async execute(node, error, client) {

        console.log(`Node ${node.options.name} connection error ${error.toString()}`)

    }
}