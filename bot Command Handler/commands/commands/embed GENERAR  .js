const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Envía un mensaje diseñado de forma profesional desde la web')
        .addStringOption(option => 
            option.setName('codigo')
                .setDescription('Pega aquí el código JSON completo generado por el diseñador')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const jsonString = interaction.options.getString('codigo');

        // Confirmación efímera de "procesando"
        await interaction.reply({ content: '⏳ Procesando el diseño...', ephemeral: true });

        try {
            // Intentamos transformar el texto en datos JSON
            const data = JSON.parse(jsonString); 

            // Creamos el constructor de Embeds
            const embed = new EmbedBuilder();

            // --- Lógica de importación de datos ---
            
            // Básico
            if (data.title) embed.setTitle(data.title);
            if (data.description) embed.setDescription(data.description);
            if (data.url) embed.setURL(data.url);
            embed.setColor(data.color || 'Random'); // Usamos color aleatorio si no se definió

            // Autor
            if (data.author && data.author.name) {
                embed.setAuthor({
                    name: data.author.name,
                    iconURL: data.author.iconURL || null
                });
            }

            // Imágenes
            if (data.image) embed.setImage(data.image);
            if (data.thumbnail) embed.setThumbnail(data.thumbnail);

            // Campos (Fields)
            if (data.fields && Array.isArray(data.fields)) {
                // Discord solo permite 25 campos como máximo
                const camposValidos = data.fields.slice(0, 25).filter(f => f.name && f.value);
                if (camposValidos.length > 0) {
                    embed.addFields(camposValidos);
                }
            }

            // Pie de Página (Footer)
            if (data.footer && data.footer.text) {
                embed.setFooter({
                    text: data.footer.text,
                    iconURL: data.footer.iconURL || null
                });
            }

            // Enviar el mensaje final al canal
            await interaction.channel.send({ embeds: [embed] });
            
            // Actualizar la confirmación efímera a éxito
            await interaction.editReply({ content: '✅ ¡Mensaje publicado con éxito!' });

        } catch (error) {
            console.error('Error al parsear el JSON:', error);
            // Avisar al moderador de que el código estaba mal pegado
            await interaction.editReply({ 
                content: '❌ El código que pegaste no es válido. Asegúrate de copiarlo TODO desde el diseñador web (incluyendo las llaves `{` y `}`).' 
            });
        }
    },
};