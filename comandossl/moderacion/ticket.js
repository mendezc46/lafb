const { Permissions, EmbedBuilder, MessageActionRow, MessageButton, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "ticket",
    description: "Envia el iniciador de tickets!",

    async execute(client, interaction){

        
        if (!interaction.member.permissions.has("Administrator")) {
            const permiso = new EmbedBuilder()
                .setColor("#ff0000")
                .setDescription("**No tienes permisos para hacer esto**");
            return interaction.reply({ embeds: [permiso], ephemeral: true });
        }
        const ticket = {
            title: "Soporte",
            Description: "Si necesitas soporte has click en el boton de abajo! Recuerda especificar lo mejor posible tu problema.",
            footer: {
                text: 'Sistema de Soporte',
                icon_url: 'https://i.imgur.com/2JbfuqG.png',
            },
        }
        

        const moticket = new ButtonBuilder()
            .setCustomId("modalticket")
            .setLabel("Abrir Ticket!")
            .setStyle(2);

        const modalticketrow = new ActionRowBuilder()
            .addComponents(moticket);

        await interaction.reply({ embeds: [ticket], components: [modalticketrow] });
    }
};
