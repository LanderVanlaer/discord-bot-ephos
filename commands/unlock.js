const { MessageEmbed } = require("discord.js");
const { channels: { lockUnlock: logbook } } = require("../jsonData/botconfig.json");
const { GREEN } = require("../jsonData/colors.json");
const { roles: { basic: communityRole } } = require("../jsonData/botconfig.json");
const fs = require('fs').promises;

module.exports.run = async (bot, message, args) => {
    const { channel } = message;

    let file = JSON.parse(await fs.readFile('./jsonData/lockUnlockData.json', 'utf8').catch(console.error));
    const channelPermissions = file.find(x => x.id == channel.id);
    if (!channelPermissions) return message.reply("This channel isn't locked!");

    file = file.filter(x => !(x.id == channel.id))

    fs.writeFile('./jsonData/lockUnlockData.json', JSON.stringify(file, null, 2), err => err && console.log(err));


    try {
        await channel.overwritePermissions(channelPermissions.permissions);
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