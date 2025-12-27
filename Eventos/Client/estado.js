const { ActivityType } = require("discord.js")
const { status } = require('minecraft-server-util');

module.exports = {
	name: "ready",
	once: true,

	async execute(client, interaction){

		let playerCount = 0;

		// Función para actualizar el estado del bot
		function updateBotStatus() {
			client.user.setPresence({
				activities: [{
					name: `${playerCount} Jugadores conectados`,
					type: ActivityType.Playing
				}],
				status: "online"
			});
		}

		// Actualizar estado del bot cada vez que cambie playerCount
		setInterval(() => {
			updateBotStatus();
		}, 30000) // Actualizar cada 30 segundos


		function statusCount(){
			let guild = client.guilds.cache.get('660596096447545356')
	
			client.channels.cache.get('1019488599072325692').setName(`👥 Miembros- ${guild.memberCount}`)
			client.channels.cache.get('1019488677480632421').setName(`👤 Usuarios - ${guild.members.cache.filter(member => !member.user.bot).size}`)
			client.channels.cache.get('1019488694496919643').setName(`🤖 Bots - ${guild.members.cache.filter(member => member.user.bot).size}`)
		}

		async function updateMinecraftStatus(){
			try {
				const response = await status('104.243.47.209', 25579, {
					timeout: 5000
				});
				
				playerCount = response.players.online;
				updateBotStatus(); // Actualizar el estado del bot cuando cambie playerCount
				
				const channelId = '1450569858050822351';
				const channel = client.channels.cache.get(channelId);
				
				if (channel) {
					await channel.setName(`⛏️ Conectados: ${playerCount}`);
					console.log(`✅ Servidor Minecraft: ${playerCount} jugadores conectados`);
				}
			} catch (error) {
				console.error('❌ Error al obtener estado del servidor de Minecraft:', error.message);
				// Si hay error, mostrar "Offline" o mantener el último valor conocido
				const channelId = '1450569858050822351';
				const channel = client.channels.cache.get(channelId);
				if (channel) {
					await channel.setName(`⛏️ Conectados: Offline`);
				}
			}
		}

		setInterval(() => {
			statusCount(); 
		}, 300000) // 5 minutos - respeta rate limits de Discord
		statusCount();
		
		// Actualizar estado del servidor de Minecraft cada 5 minutos
		setInterval(() => {
			updateMinecraftStatus(); 
		}, 300000) // 5 minutos - respeta rate limits de Discord
		updateMinecraftStatus();
		
		
	}
}

