const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Juega un minijuego rápido de azar'),
    async execute(interaction) {
        const opciones = [
            '🏆 ¡Has ganado el premio mayor!', 
            '❌ Has perdido esta vez, ¡sigue intentando!', 
            '🤝 ¡Es un empate técnico!',
            '💰 ¡Has encontrado 100 monedas extra!'
        ];
        const resultado = opciones[Math.floor(Math.random() * opciones.length)];
        
        await interaction.reply({
            content: `🎮 **RESULTADO DEL JUEGO:**\n\n> ${resultado}`
        });
    },
};