const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Muestra información del servidor'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`Información de ${interaction.guild.name}`)
            .addFields(
                { name: 'Miembros total', value: `${interaction.guild.memberCount}`, inline: true },
                { name: 'Creado el', value: `${interaction.guild.createdAt.toDateString()}`, inline: true }
            )
            .setColor('#5865F2');
        await interaction.reply({ embeds: [embed] });
    },
};