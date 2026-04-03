const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Muestra información de un usuario')
        .addUserOption(option => option.setName('usuario').setDescription('El usuario')),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const embed = new EmbedBuilder()
            .setTitle(`Info de ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields({ name: 'ID', value: user.id })
            .setColor('#5865F2');
        await interaction.reply({ embeds: [embed] });
    },
};