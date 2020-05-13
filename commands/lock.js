const { MessageEmbed } = require("discord.js");
const { channels: { lockUnlock: logbook }, roles: { lockUnlockAllowedToChat: allowedRoles } } = require("../jsonData/botconfig.json");
const { DARK_RED } = require("../jsonData/colors.json");
const fs = require('fs').promises;

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command`);
    const { channel, channel: { permissionOverwrites } } = message;


    let file = JSON.parse(await fs.readFile('./jsonData/lockUnlockData.json', 'utf8').catch(console.error));
    if (file.find(x => x.id == channel.id)) return message.reply("This channel is already locked!");
    file.push({
        id: channel.id,
        permissions: permissionOverwrites
    })
    fs.writeFile('./jsonData/lockUnlockData.json', JSON.stringify(file, null, 2), err => err && console.log(err));



    const allowed = allowedRoles.map(allowedRole => {
        const r = message.guild.roles.cache.find(x => x.id == allowedRole || x.name == allowedRole);
        if (!r) return

        const permissions = permissionOverwrites.find(permission => permission.id == r.id);
        return permissions;
    }).filter(x => !!x);


    try {
        await channel.overwritePermissions([...allowed, { id: channel.guild.roles.everyone, deny: 'SEND_MESSAGES' }]);
        // await channel.updateOverwrite(communityRole, {
        //     "SEND_MESSAGES": false,
        //     "ADD_REACTIONS": false
        // });
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