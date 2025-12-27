const { ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');

async function handlerTI(interaction) {
    if (interaction.isButton()) {
        if (interaction.customId === "modalticket") {
            const modal = new ModalBuilder()
                .setCustomId("datos")
                .setTitle("Ticket!");
                

            const nick = new TextInputBuilder()
                .setCustomId("nick")
                .setLabel("Nick")
                .setPlaceholder("Ingresa tu Nick")
                .setStyle(TextInputStyle.Short)
                .setMinLength(4)
                .setMaxLength(20);

            const problema = new TextInputBuilder()
                .setCustomId("problema")
                .setLabel("Detalla tu problema")
                .setPlaceholder("Da una breve descripcion de tu problema")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(1000);

            const l1 = new ActionRowBuilder()
                .addComponents(nick);

            const l2 = new ActionRowBuilder()
                .addComponents(problema);

            modal.addComponents(l1, l2);

            try {
                await interaction.showModal(modal);
            } catch (error) {
                console.error("Error al mostrar el modal de tickets: ", error);
                await interaction.reply({ content: `Hubo un error al abrir el modal de tickets.`, ephemeral: true });
            }
        } else if (interaction.customId === "cerrarTicket") {
            try {
                await interaction.deferUpdate();
                
                const message = await interaction.channel.send({ content: '¿Estás seguro de que deseas cerrar este ticket? Este canal será eliminado en 10 segundos si no se cancela el cierre.', ephemeral: true });

                const botonConfirmar = new ButtonBuilder()
                    .setCustomId('confirmarCierre')
                    .setLabel('Confirmar Cierre')
                    .setStyle(3);

                const botonCerrar = new ButtonBuilder()
                    .setCustomId('cancelarCierre')
                    .setLabel('Cancelar Cierre')
                    .setStyle(2);

                const l1 = new ActionRowBuilder()
                    .addComponents(botonConfirmar, botonCerrar);

                await message.edit({ components: [l1] });

                const filter = i => (i.customId === 'confirmarCierre' || i.customId === 'cancelarCierre') && i.user.id === interaction.user.id;
                const collector = message.createMessageComponentCollector({ filter, time: 10000 });

                collector.on('collect', async i => {
                    if (i.customId === 'confirmarCierre') {
                        collector.stop('cerrado');
                    } else if (i.customId === 'cancelarCierre') {
                        collector.stop('cancelado');
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (message.deletable) await message.delete();
                    if (reason === 'cerrado') {
                        await interaction.channel.delete();
                    } else if (reason === 'cancelado') {
                    } else {
                        await interaction.channel.delete();
                    }
                });
            } catch (error) {
                console.error("Error al cerrar el ticket: ", error);
                await interaction.reply({ content: `Hubo un error al cerrar el ticket.`, ephemeral: true });
            }
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "datos") {
            const nick = interaction.fields.getTextInputValue("nick");
            const problema = interaction.fields.getTextInputValue("problema");

            console.log("Nick:", nick);
            console.log("Problema:", problema);

            const staffRoleId = "682009380459249684";
            const category = "1016815335258734684";

            async function createTicket(interaction, category, nick, problema) {
                try {
                    const channel = await interaction.guild.channels.create({
                        name: `ticket-${interaction.user.username}`,
                        type: 0,
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: staffRoleId,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            }
                        ]
                    });

                    const embedTicketCreado = {
                        color: 0x0099ff,
                        title: 'Espera mientras un staff revisa tu Ticket!',
                        author: {
                            name: 'LaFinca',
                            icon_url: 'https://i.imgur.com/2JbfuqG.png',
                        },
                        fields: [
                            {
                                name: 'Nick',
                                value: `\`\`\`${nick}\`\`\``,
                            },
                            {
                                name: 'Problema',
                                value: `\`\`\`${problema}\`\`\``,
                            },
                        ]
                    };

                    const cerrar = new ButtonBuilder()
                        .setCustomId('cerrarTicket')
                        .setLabel('Cerrar Ticket')
                        .setStyle(4);

                    const row = new ActionRowBuilder()
                        .addComponents(cerrar);

                    await channel.send({ embeds: [embedTicketCreado], components: [row], content: `<@&${staffRoleId}> <@${interaction.user.id}>` });
                    await interaction.reply({ content: `Tu Ticket ha sido generado!`, ephemeral: true });
                } catch (error) {
                    console.error("Error al crear el ticket: ", error);
                    await interaction.reply({ content: `Hubo un error al crear el ticket.`, ephemeral: true });
                }
            }

            await createTicket(interaction, category, nick, problema);
        }
    }
}

module.exports = { handlerTI };
