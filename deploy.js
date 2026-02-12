require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const loadedCommandNames = new Set(); // Para evitar duplicados

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
    try {
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            const commandName = command.data.name;
            // Evitar comandos duplicados
            if (!loadedCommandNames.has(commandName)) {
                commands.push(command.data.toJSON());
                loadedCommandNames.add(commandName);
                console.log(`✅ Comando preparado: ${commandName}`);
            } else {
                console.warn(`⚠️ Comando duplicado ignorado: ${commandName}`);
            }
        }
    } catch (error) {
        console.warn(`⚠️ No se pudo cargar ${path.basename(filePath)}: ${error.message}`);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Empezando a registrar comandos slash...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );
        console.log('✅ ¡Comandos registrados con éxito!');
    } catch (error) {
        console.error(error);
    }
})();