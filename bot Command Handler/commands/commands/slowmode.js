const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Activa el modo lento en el canal')
        .addIntegerOption(option => option.setName('segundos').setDescription('Tiempo en segundos').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const seconds = interaction.options.getInteger('segundos');
        await interaction.channel.setRateLimitPerUser(seconds);
        await interaction.reply(`⏱️ Modo lento activado: **${seconds}s**`);
    },
};