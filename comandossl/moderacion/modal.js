const { ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require("discord.js")

    module.exports = {
        name: "embedm",
        description: "Descripcion",

        async execute(interaction){
            const modal = new ModalBuilder()
            .setCustomId("CustomE")
            .setTitle("Embed Custom!")

            const canal = new TextInputBuilder()
            .setCustomId("canal")
            .setLabel("Id Del Canal")
            .setStyle(TextInputStyle.Short)

            const sobreti = new TextInputBuilder()
            .setCustomId("sobreti")
            .setLabel("Cuenta ti")
            .setStyle(TextInputStyle.Paragraph)

            const row = new ActionRowBuilder()
            .addComponents(canal)

            const row2 = new ActionRowBuilder()
            .addComponents(sobreti)

            modal.addComponents(row, row2)

            interaction.showModal(modal)

            const canalId = interaction.fields.getTextInputValue("canal");
            const sobreTi1 = interaction.fields.getTextInputValue("sobreti");

            console.log("Nick:", canalId);
            console.log("Problema:", sobreTi1);
            
        }
        }