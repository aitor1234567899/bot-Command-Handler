const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Borra mensajes del chat')
        .addIntegerOption(option => option.setName('cantidad').setDescription('Número de mensajes').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('cantidad');
        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `🧹 Borrados ${amount} mensajes.`, ephemeral: true });
    },
};