const { EmbedBuilder } = require('discord.js');
const { status } = require('minecraft-server-util');

module.exports = {
    name: "estado",
    description: "Muestra el estado del servidor de Minecraft",

    async execute(client, message, args) {
        try {
            let playerCount = 0;
            let maxPlayers = 0;
            let serverOnline = false;

            try {
                const response = await status('104.243.47.209', 25579, {
                    timeout: 5000
                });
                
                serverOnline = true;
                playerCount = response.players.online;
                maxPlayers = response.players.max;
            } catch (error) {
                console.error('❌ Error al obtener estado del servidor:', error.message);
                serverOnline = false;
            }

            // Crear el embed
            const embed = new EmbedBuilder()
                .setTitle("La Finca")
                .setThumbnail("https://i.imgur.com/rtYgrPM.png")
                .setColor(serverOnline ? "#00ff00" : "#ff0000")
                .addFields(
                    {
                        name: "📍 IP del Servidor",
                        value: "lafinca.playwn.co",
                        inline: false
                    },
                    {
                        name: "🎮 Estado",
                        value: serverOnline ? `**Online** ✅` : "**Offline** ❌",
                        inline: true
                    },
                    {
                        name: "👥 Jugadores",
                        value: `${playerCount}/${maxPlayers}`,
                        inline: true
                    },
                    {
                        name: "📦 Instalación",
                        value: "Para entrar instala el modpack",
                        inline: false
                    },
                    {
                        name: "📖 Instrucciones",
                        value: "Ve a <#1435471444586008576> para ver cómo entrar",
                        inline: false
                    }
                )
                .setFooter({ text: "La Finca Minecraft Server" })
                .setTimestamp();

            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en el comando estado:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor("#ff0000")
                .setDescription("❌ Error al obtener el estado del servidor");
            
            await message.reply({ embeds: [errorEmbed] });
        }
    }
}
