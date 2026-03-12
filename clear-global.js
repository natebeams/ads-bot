const { REST, Routes } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1481154081107218547";

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log("Clearing GLOBAL commands...");

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: [] }
        );

        console.log("Global commands cleared.");

    } catch (error) {
        console.error(error);
    }
})();