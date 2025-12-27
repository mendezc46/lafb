const { readdirSync } = require("node:fs");

module.exports = {
    async loadPrefix(client) {
        const commandsFolder = "./comandossl";
        client.prefixCommands = new (require("discord.js")).Collection();

        for (const category of readdirSync(commandsFolder)) {
            for (const fileName of readdirSync(`${commandsFolder}/${category}`)) {
                if (fileName.endsWith(".js")) {
                    const command = require(`../${commandsFolder}/${category}/${fileName}`);
                    client.prefixCommands.set(command.name, command);
                }
            }
        }
    }
};
