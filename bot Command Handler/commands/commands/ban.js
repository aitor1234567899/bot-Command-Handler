const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario del servidor')
        .addUserOption(option => option.setName('usuario').setDescription('El usuario a banear').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        await interaction.guild.members.ban(user);
        await interaction.reply(`🔨 **${user.tag}** ha sido baneado.`);
    },
};