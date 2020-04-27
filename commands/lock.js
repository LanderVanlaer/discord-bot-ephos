const { MessageEmbed } = require("discord.js");
const { channels: { lockUnlock: logbook }, roles: { basic: communityRole } } = require("../jsonData/botconfig.json");
const { DARK_RED } = require("../jsonData/colors.json");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command`);
    const { channel } = message;

    try {
        await channel.updateOverwrite(communityRole, {
            "SEND_MESSAGES": false,
            "ADD_REACTIONS": false
        });
    } catch (error) {
        console.error(error)
    }
    channel.send(`Channel <#${channel.id}> is locked`);
    message.delete().catch(console.error);

    const logbookChannel = message.guild.channels.cache.find(x => x.name == logbook || x.id == logbook);
    if (!logbookChannel) return message.reply(`Channel "${logbook}" not found, ask a mod for help!`);

    logbookChannel.send(
        new MessageEmbed()
        .setColor(DARK_RED)
        .setAuthor("Channel lock")
        .addField("Channel locked by", `<@${message.author.id}> `)
        .addField("Locked Channel", `<#${channel.id}> `)
        .setThumbnail(message.author.displayAvatarURL())
    );
}

module.exports.help = {
    name: "lock",
    description: "Lock this channel",
    administrator: true,
    usage: "lock"
}