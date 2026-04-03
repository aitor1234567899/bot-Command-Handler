const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('list-bans').setDescription('Muestra los baneados').setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const bans = await interaction.guild.bans.fetch();
        const lista = bans.map(b => `${b.user.tag} (${b.user.id})`).join('\n') || 'No hay nadie baneado.';
        const embed = new EmbedBuilder().setTitle('🚫 Lista de Baneados').setDescription(lista).setColor('Red');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};