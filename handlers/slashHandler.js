const { readdirSync } = require("node:fs");

module.exports = {
    async loadSlash(client) {
        const commandsFolder = "./comandossl";

        for (const category of readdirSync(commandsFolder)) {
            for (const fileName of readdirSync(`${commandsFolder}/${category}`)) {
                if (fileName.endsWith(".js")) {
                    const command = require(`../${commandsFolder}/${category}/${fileName}`);
                    client.slashCommands.set(command.name, command);
                }
            }
        }

        await client.application?.commands.set(client.slashCommands.map((x) => x));
    }
};
