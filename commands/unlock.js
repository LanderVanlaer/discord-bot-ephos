const { MessageEmbed } = require("discord.js");
const { channels: { logbook } } = require("../jsonData/botconfig.json");
const { GREEN } = require("../jsonData/colors.json");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command`);
    const { channel } = message;

    try {
        await channel.overwritePermissions([{
            id: message.guild.roles.everyone.id,
            allow: [
                "SEND_MESSAGES",
                "ADD_REACTIONS"
            ]
        }]);
    } catch (error) {
        console.error(error)
    }
    channel.send(`Channel <#${channel.id}> is unlocked`);
    message.delete().catch(console.error);

    const logbookChannel = message.guild.channels.cache.find(x => x.name == logbook || x.id == logbook);
    if (!logbookChannel) return message.reply(`Channel "${logbook}" not found, ask a mod for help!`);

    logbookChannel.send(
        new MessageEmbed()
        .setColor(GREEN)
        .setAuthor("Channel unlock")
        .addField("Channel unlocked by", `<@${message.author.id}> `)
        .addField("unlocked Channel", `<#${channel.id}> `)
        .setThumbnail(message.author.displayAvatarURL())
    );
}

module.exports.help = {
    name: "unlock",
    description: "unlock this channel",
    administrator: true,
    usage: "unlock"
}