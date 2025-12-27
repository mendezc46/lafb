const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "modpack",
    description: "Muestra información sobre los launchers y cómo descargar el modpack",

    async execute(client, interaction, args) {
        // Embed principal
        const embed = new EmbedBuilder()
            .setTitle("📦 Modpack - Guía de Instalación")
            .setColor("#FF6B35")
            .setThumbnail("https://i.imgur.com/rtYgrPM.png")
            
            // Launchers recomendados
            .addFields(
                {
                    name: "🚀 Launchers Recomendados",
                    value: "Elige el que mejor se adapte a ti",
                    inline: false
                },
                {
                    name: "👑 Curse Forge (Para usuarios premium)",
                    value: "[Descargar Curse Forge](https://download.overwolf.com/installer/prod/42ae0993ee908e95f783d74118b8bbcd/CurseForge%20Windows%20-%20Installer.exe)\n*La opción recomendada para usuarios con licencia completa*",
                    inline: false
                },
                {
                    name: "🎮 Prism Launcher (Para usuarios no premium)",
                    value: "[Descargar Prism Launcher](https://github.com/Diegiwg/PrismLauncher-Cracked/releases/download/9.4/PrismLauncher-Windows-MinGW-w64-Setup-9.4.exe)\n*La mejor opción si no tienes licencia*",
                    inline: false
                }
            )

            // Importar modpack
            .addFields(
                {
                    name: "📥 Importar el Modpack",
                    value: "Una vez instalado el launcher, importa nuestro modpack usando el siguiente enlace:",
                    inline: false
                },
                {
                    name: "📎 Enlace del Modpack",
                    value: "[Descargar desde Google Drive](https://drive.google.com/file/d/1f7QZLCElVF12NA5BlH5-31_fI2dizheU/view?usp=sharing)",
                    inline: false
                }
            )

            // Instalación manual
            .addFields(
                {
                    name: "⚙️ Instalación Manual",
                    value: "Si prefieres no usar ninguno de los launchers recomendados y deseas instalar el modpack manualmente, descarga el paquete completo:",
                    inline: false
                },
                {
                    name: "📦 Modpack Completo",
                    value: "[Descargar Modpack Completo](https://drive.google.com/file/d/15Ve-W3NUc8cr0QDxW4qj1O0-sm__tIvl/view?usp=sharing)\n*Incluye todos los archivos necesarios para una instalación manual*",
                    inline: false
                }
            )

            // Soporte y ayuda
            .addFields(
                {
                    name: "💬 Canal de Soporte",
                    value: "Si tienes dudas o necesitas ayuda con la instalación, [entra al canal de soporte](https://discord.com/channels/660596096447545356/1449564356751917136)",
                    inline: false
                },
                {
                    name: "📖 Guía Detallada",
                    value: "Para una guía más detallada paso a paso, [revisa este canal](https://discord.com/channels/660596096447545356/1450649069134545117)",
                    inline: false
                }
            )

            // Guías y videos
            .addFields(
                {
                    name: "🎬 Tutoriales en Video",
                    value: "Haz clic en los botones de abajo para ver los tutoriales:",
                    inline: false
                }
            )

            // Footer
            .setFooter({ text: "La Finca Minecraft Server | ¡Que disfrutes el modpack!" })
            .setTimestamp();

        // Botones para los videos
        const videoButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('🎬 Ver Video Curse Forge')
                    .setURL('https://medal.tv/es/games/minecraft/clips/lLgpqIjfqav95aExn?invite=cr-MSxvaDMsMjkyODkzOTk3&v=72')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('🎬 Ver Video Prism Launcher')
                    .setURL('https://medal.tv/es/games/minecraft/clips/lLgryqbu3H7qHlUXo?invite=cr-MSxyd2MsMjkyODkzOTk3&v=71')
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.reply({ embeds: [embed], components: [videoButtons] });
    }
};
