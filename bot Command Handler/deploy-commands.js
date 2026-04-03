require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

// Función para buscar en todas las subcarpetas
function getCommandFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            getCommandFiles(fullPath, files);
        } else if (entry.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

const commandFiles = getCommandFiles(path.join(__dirname, 'commands'));

for (const filePath of commandFiles) {
    // Borramos la caché para cargar el archivo limpio
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);

    // COMPATIBILIDAD DOBLE:
    // 1. Si usa SlashCommandBuilder (command.data)
    if (command.data && typeof command.data.toJSON === 'function') {
        commands.push(command.data.toJSON());
    } 
    // 2. Si usa el formato simple (name y description)
    else if (command.name && command.description) {
        commands.push({
            name: command.name.toLowerCase(),
            description: command.description
        });
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`🔄 Iniciando actualización de ${commands.length} comandos...`);

        // Esto registra los comandos en TU servidor específico (GUILD_ID)
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('✅ ¡Éxito! Todos los comandos han sido registrados en Discord.');
        console.log('💡 Si no los ves, reinicia tu aplicación de Discord (Ctrl + R).');
    } catch (error) {
        console.error('❌ Error al registrar comandos:', error);
    }
})();