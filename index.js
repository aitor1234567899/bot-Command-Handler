require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Solo necesitamos el intent de Guilds para comandos slash
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

client.commands = new Collection();

// --- CARGA DE COMANDOS ---
// Soporta subcarpetas en 'commands'
const commandsPath = path.join(__dirname, 'commands');

function getCommandFiles(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) getCommandFiles(full, files);
        else if (entry.name.endsWith('.js')) files.push(full);
    }
    return files;
}

if (fs.existsSync(commandsPath)) {
    const commandFiles = getCommandFiles(commandsPath);

    for (const filePath of commandFiles) {
        const command = require(filePath);
        // Verificamos que el comando tenga la estructura de Slash Command (data y execute)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Comando cargado: ${command.data.name}`);
        }
    }
}

client.once(Events.ClientReady, c => {
    console.log(`🚀 ¡Bot en línea! Autenticado como ${c.user.tag}`);
});

// --- MANEJADOR DE INTERACCIONES ---
client.on(Events.InteractionCreate, async interaction => {
    // Si no es un comando slash, no hacemos nada
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No se encontró el comando ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ Hubo un error al ejecutar este comando.', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ Hubo un error al ejecutar este comando.', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);