const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia en color rojo'),
    async execute(interaction) {
        // Calculamos la latencia
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        // Creamos el diseño (Embed) en color rojo
        const pingEmbed = new EmbedBuilder()
            .setColor(0xFF0000) // Color Rojo puro
            .setDescription(`**!pong: ${apiLatency}ms**`);

        // Enviamos el mensaje
        await interaction.reply({ embeds: [pingEmbed] });
    },
};