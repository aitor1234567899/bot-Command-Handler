const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Envía un mensaje privado a alguien')
        .addUserOption(option => option.setName('usuario').setDescription('El usuario').setRequired(true))
        .addStringOption(option => option.setName('mensaje').setDescription('Qué quieres decirle').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const text = interaction.options.getString('mensaje');
        try {
            await user.send(text);
            await interaction.reply({ content: `✅ Mensaje enviado a ${user.tag}`, ephemeral: true });
        } catch {
            await interaction.reply({ content: '❌ No pude enviar el mensaje (DM cerrado).', ephemeral: true });
        }
    },
};