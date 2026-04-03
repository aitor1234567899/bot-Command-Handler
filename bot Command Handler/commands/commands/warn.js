const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Pone una advertencia a un usuario y le avisa por DM')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario a advertir')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('motivo')
                .setDescription('Razón de la advertencia')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Solo staff
    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario');
        const motivo = interaction.options.getString('motivo');
        const colorAleatorio = Math.floor(Math.random() * 16777215); // Tu estilo de color

        if (usuario.bot) return interaction.reply({ content: '❌ No puedes advertir a un bot.', ephemeral: true });

        // Embed para el usuario advertido (DM)
        const embedDM = new EmbedBuilder()
            .setTitle('⚠️ Has sido advertido')
            .setDescription(`Se te ha puesto una advertencia en **${interaction.guild.name}**`)
            .addFields({ name: '📝 Motivo:', value: motivo })
            .setColor('Orange')
            .setTimestamp();

        // Embed para el canal (Confirmación)
        const embedCanal = new EmbedBuilder()
            .setTitle('✅ Usuario Advertido')
            .addFields(
                { name: '👤 Usuario:', value: `${usuario.tag}`, inline: true },
                { name: '👮 Moderador:', value: `${interaction.user.tag}`, inline: true },
                { name: '📝 Motivo:', value: motivo }
            )
            .setColor(colorAleatorio)
            .setTimestamp();

        try {
            await usuario.send({ embeds: [embedDM] });
            await interaction.reply({ embeds: [embedCanal] });
        } catch (error) {
            // Si tiene los DM cerrados, avisamos pero ponemos el warn igual
            await interaction.reply({ 
                content: `⚠️ El usuario fue advertido pero no pude enviarle el mensaje privado.`, 
                embeds: [embedCanal] 
            });
        }
    },
};