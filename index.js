require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Solo necesitamos el intent de Guilds para comandos slash
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

client.commands = new Collection();
const loadedCommandNames = new Set(); // Para evitar duplicados

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
        try {
            // Limpiar el cache de require para recargar archivos modificados
            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);
            // Verificamos que el comando tenga la estructura de Slash Command (data y execute)
            if ('data' in command && 'execute' in command) {
                const commandName = command.data.name;
                // Evitar comandos duplicados
                if (!loadedCommandNames.has(commandName)) {
                    client.commands.set(commandName, command);
                    loadedCommandNames.add(commandName);
                    console.log(`✅ Comando cargado: ${commandName}`);
                } else {
                    console.warn(`⚠️ Comando duplicado ignorado: ${commandName}`);
                }
            } else {
                console.warn(`⚠️ Estructura inválida en ${path.basename(filePath)}`);
            }
        } catch (error) {
            console.warn(`⚠️ No se pudo cargar ${path.basename(filePath)}: ${error.message}`);
        }
    }
    console.log(`📦 Total de comandos válidos cargados: ${client.commands.size}`);
} else {
    console.warn(`⚠️ Carpeta 'commands' no encontrada`);
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