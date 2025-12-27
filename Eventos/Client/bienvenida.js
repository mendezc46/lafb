const { EmbedBuilder } = require('discord.js');

function bienvenida(member) {
    const embed = new EmbedBuilder()
        .setTitle('LaFinca')
        .setDescription(`Bienvenido ${member.user.tag}`)
        .setTimestamp()
        .setColor("#0a99a3")
        .addFields(
            { name: "Configurando...", value: `Si necesitas ayuda apertura un ticket!`, inline: true })
        .setFooter({
            text: "Configurando servidor..."
        })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

    const channelId = '1016644425646092288';
    const channel = member.guild.channels.cache.get(channelId);
    if (channel) {
        channel.send({ embeds: [embed] });
    } else {
        console.error("El canal de bienvenida no existe");
    }
}

module.exports = { bienvenida };
