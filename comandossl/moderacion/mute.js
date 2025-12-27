const ms = require("ms");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "mute",
    alias: ['mt', 'mut'],
    description: "Mutea un Usuario",
    options: [
        {
            name: "jugador",
            description: "Etiqueta al jugador.",
            type: 6, 
            required: true,
        },
        {
            name: "tiempo",
            description: "Cuanto tiempo mutearas al jugador. Ejemplo: 10m, 1h, 1d.",
            type: 3,
            required: true,
        },
        
    ],

    async execute(client, interaction, args) {
        try {
            const member = interaction.options.get("jugador").member;
            const time = args[1];

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

            let muteRole = interaction.guild.roles.cache.find(role => role.name === "Muteado");
            if (!muteRole) {
                try {
                    muteRole = await interaction.guild.roles.create({
                        name: "Muteado",
                        color: "#ff0000",
                        permissions: []
                    });

                    // Itera sobre todos los canales del servidor y deniega el permiso de enviar mensajes para el rol "Muteado"
                    interaction.guild.channels.cache.forEach(async (channel) => {
                        if (channel.type === 'GuildVoice') return;
                        try {
                            await channel.permissionOverwrites.edit(muteRole, {
                                SendMessages: false
                            });
                        } catch (error) {
                            console.error(`Error al sobrescribir permisos para el canal ${channel.name}:`, error);
                        }
                    });
                } catch (rolerror) {
                    console.error("**Error al crear el rol Muteado:", rolerror);
                    const embed = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setDescription("Hubo un error al crear el rol Muteado.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }

            if (!/^\d+[smhd]$/i.test(time)) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription("**Solo se aceptan formatos de s/m/h/d.**");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (member.roles.cache.has(muteRole.id)) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription("**El usuario ya está muteado**");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.roles.add(muteRole);

            setTimeout(async () => {
                await member.roles.remove(muteRole);

                const unMuteEmbed = new EmbedBuilder()
                    .setColor("#00ff00")
                    .setDescription(`**${member.user.tag} ya no está muteado.**`);
                interaction.channel.send({ embeds: [unMuteEmbed] });
            }, ms(time));

            const embed = new EmbedBuilder()
                .setColor("#FFECA1")
                .setDescription(`**${member.user.tag} ha sido muteado por ${time}.**`);
            await interaction.reply({ embeds: [embed]});
        } catch (boterror) {
            console.error(boterror);
            await interaction.reply({ content: "**El bot tuvo un error al intentar hacer esto.**", ephemeral: true });
        }
    }
};
