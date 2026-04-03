const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('slowmode-off').setDescription('Quita el modo lento').setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        await interaction.channel.setRateLimitPerUser(0);
        await interaction.reply({ content: '✅ Modo lento desactivado.', ephemeral: true });
    },
};