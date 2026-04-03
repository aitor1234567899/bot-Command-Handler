const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Mira el avatar de un usuario')
        .addUserOption(option => option.setName('objetivo').setDescription('El usuario')),
    async execute(interaction) {
        const user = interaction.options.getUser('objetivo') || interaction.user;
        await interaction.reply(user.displayAvatarURL({ dynamic: true, size: 1024 }));
    },
};