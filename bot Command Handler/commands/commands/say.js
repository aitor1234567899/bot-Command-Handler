const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Hace que el bot diga un mensaje')
        .addStringOption(option => option.setName('mensaje').setDescription('Qué debe decir el bot').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const text = interaction.options.getString('mensaje');
        await interaction.channel.send(text);
        await interaction.reply({ content: 'Mensaje enviado.', ephemeral: true });
    },
};