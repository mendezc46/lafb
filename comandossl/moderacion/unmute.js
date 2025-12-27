const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "unmute",
    alias: ['um', 'unmt'],
    description: "Desmutea a un Usuario",
    options: [
        {
            name: "jugador",
            description: "Etiqueta al jugador.",
            type: 6, 
            required: true,
        }
    ],

    async execute(client, interaction, args) {
        try {
            const member = interaction.options.get("jugador").member;

            if (!member) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription("**Debes mencionar a un usuario.**");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            
            if (!interaction.member.permissions.has("MuteMembers")) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription("**No tienes permisos para hacer esto**");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const muteRole = interaction.guild.roles.cache.find(role => role.name === "Muteado");
            if (!muteRole) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription("**No se encontró el rol de muteado.**");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (!member.roles.cache.has(muteRole.id)) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription("**El usuario no está muteado.**");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.roles.remove(muteRole);

            const embed = new EmbedBuilder()
                .setColor("#00ff00")
                .setDescription(`**${member.user.tag} fue desmuteado.**`);
            await interaction.reply({ embeds: [embed] });
        } catch (boterror) {
            console.error(boterror);
            await interaction.reply({ content: "**El bot tuvo un error al intentar hacer esto.**", ephemeral: true });
        }
    }
};
