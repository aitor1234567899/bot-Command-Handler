const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Crea una encuesta rápida')
        .addStringOption(option => option.setName('pregunta').setDescription('La pregunta').setRequired(true)),
    async execute(interaction) {
        const quest = interaction.options.getString('pregunta');
        const embed = new EmbedBuilder()
            .setTitle('📊 Encuesta')
            .setDescription(quest)
            .setColor('#3ba55c')
            .setFooter({ text: `Creada por ${interaction.user.username}` });
        
        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        await message.react('👍');
        await message.react('👎');
    },
};