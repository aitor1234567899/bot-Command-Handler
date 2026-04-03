const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Desbanea a un usuario usando su ID')
        .addStringOption(option => option.setName('id').setDescription('ID del usuario').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const userId = interaction.options.getString('id');
        try {
            await interaction.guild.members.unban(userId);
            await interaction.reply(`✅ Usuario con ID **${userId}** desbaneado.`);
        } catch (error) {
            await interaction.reply({ content: '❌ No se encontró el baneo para esa ID.', ephemeral: true });
        }
    },
};