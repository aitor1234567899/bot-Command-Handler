require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

function getCommandFiles(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) getCommandFiles(full, files);
        else if (entry.name.endsWith('.js')) files.push(full);
    }
    return files;
}

const commandFiles = getCommandFiles(path.join(__dirname, 'commands'));

for (const filePath of commandFiles) {
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Cargando ${commands.length} comandos slash...`);
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );
        console.log('✅ Comandos registrados con éxito en el servidor.');
    } catch (error) {
        console.error(error);
    }
})();