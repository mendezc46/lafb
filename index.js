const express = require("express");
const cron = require("node-cron");
const fetch = require("node-fetch");
const { Client, Collection } = require("discord.js");
const { loadSlash } = require("./handlers/slashHandler");
const { loadPrefix } = require("./handlers/prefixHandler");
const { loadEvents } = require("./handlers/eventHandler");
const { bienvenida } = require('./Eventos/Client/bienvenida');
const { handlerTI } = require("./handlers/ticketHandler");
require("dotenv").config();

// ============================================
// SERVIDOR WEB - Render.com Keep-Alive
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// URL del servicio (para pings automáticos)
// Render proporciona RENDER_EXTERNAL_URL automáticamente
const SERVICE_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

app.get("/", (req, res) => {
    res.status(200).send("Bot activo 24/7");
});

app.listen(PORT, () => {
    console.log(`Servidor web escuchando en puerto ${PORT}`);
    if (process.env.RENDER_EXTERNAL_URL) {
        console.log(`🌐 URL externa: ${process.env.RENDER_EXTERNAL_URL}`);
    }
});

// ============================================
// PING AUTOMÁTICO - Render Keep-Alive
// ============================================
// Hace ping cada 5 minutos para evitar que Render duerma el servicio
cron.schedule("*/5 * * * *", async () => {
    try {
        const response = await fetch(SERVICE_URL);
        console.log(`⏰ [${new Date().toLocaleString('es-ES')}] 🔄 Ping automático enviado - Status: ${response.status}`);
    } catch (error) {
        console.error(`⏰ [${new Date().toLocaleString('es-ES')}] ⚠️ Error al enviar ping:`, error.message);
    }
});

// ============================================
// BOT DE DISCORD
// ============================================
const client = new Client({ intents: 3276799 });
client.slashCommands = new Collection();
client.prefixCommands = new Collection();

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

// Capturar excepciones no manejadas
process.on('uncaughtException', (error) => {
    console.error('❌ Error no manejado:', error);
});

// Capturar promesas rechazadas no manejadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});

// Errores del cliente de Discord
client.on('error', (error) => {
    console.error('❌ Error del cliente Discord:', error);
});

// Cuando el bot se desconecta
client.on('disconnect', () => {
    console.warn('⚠️ Bot desconectado de Discord');
});

// Cuando el bot se vuelve a conectar
client.on('reconnecting', () => {
    console.log('🔄 Reconectando al servidor de Discord...');
});

// ============================================
// EVENTOS DEL BOT
// ============================================

client.on('guildMemberAdd', bienvenida);

client.on("interactionCreate", async (interaction) => {
    try {
        await handlerTI(interaction);
    } catch (error) {
        console.error('❌ Error en handler de tickets:', error);
    }
});

// ============================================
// MANEJADOR DE COMANDOS CON PREFIJO
// ============================================

client.on("messageCreate", async (message) => {
    const prefix = "!";

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);

    if (!command) return;

    try {
        await command.execute(client, message, args);
    } catch (error) {
        console.error('❌ Error al ejecutar comando:', error);
        message.reply("❌ Hubo un error al ejecutar el comando");
    }
});

// ============================================
// INICIALIZACIÓN DEL BOT
// ============================================

(async () => {
    try {
        await client.login(process.env.TOKEN);
        console.log("✅ Bot iniciado");

        await loadEvents(client);
        await loadPrefix(client);
        await loadSlash(client);
        console.log("✅ Se cargaron los comandos");

        console.log("🔄 Ping automático activado - Keep-Alive cada 5 minutos");

        const canalId = "1016500266524221520";
        const canal = client.channels.cache.get(canalId);
        if (canal) {
            canal.send("✅ Bot Iniciado");
        } else {
            console.error("⚠️ La id del canal no existe");
        }
        
    } catch (error) {
        console.error(`❌ No se inicio el bot, error ${error}`);
        process.exit(1);
    }
})();
