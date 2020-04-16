const { MessageEmbed } = require("discord.js");
const BOT_CONFIG = require("../jsonData/botconfig.json");
module.exports = async message => {
    const
        logs = await message.guild.fetchAuditLogs({ type: 72 }),
        entry = logs.entries.first();

    message.guild.channels.cache.find(x => x.name == BOT_CONFIG.channels.logbook || x.id == BOT_CONFIG.channels.logbook).send({
        embed: new MessageEmbed()
            .setTitle("MESSAGE DELETE")
            .setColor("#2196F3")
            .addField("Tag", `<@${message.author.id}>`)
            .addField("Id", message.author.id)
            .addField("Deleted By", entry.executor)
            .addField("Deleted Message", message.content)
            .setThumbnail(message.author.displayAvatarURL())
    }).catch(console.error);
}