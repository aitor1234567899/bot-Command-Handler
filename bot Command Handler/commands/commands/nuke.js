const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Resetea el canal actual')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const position = interaction.channel.position;
        const newChannel = await interaction.channel.clone();
        await interaction.channel.delete();
        newChannel.setPosition(position);
        newChannel.send('☢️ ¡Canal reseteado con éxito!');
    },
};