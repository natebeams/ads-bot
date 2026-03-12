const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function clearCommands() {
    try {

        console.log("Clearing GLOBAL commands...");
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] },
        );

        console.log("Clearing GUILD commands...");
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] },
        );

        console.log("Commands cleared.");

    } catch (error) {
        console.error(error);
    }
}

clearCommands();