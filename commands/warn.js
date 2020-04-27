const
    Discord = require("discord.js"),
    { channels: { warn: warnChannelConfig }, maxWarns, prefix: PR, warnMuteTime, roles: { muteRole: roleName } } = require("../jsonData/botconfig.json"),
    fs = require("fs");
let warns = JSON.parse(fs.readFileSync("./jsonData/warnings.json", "utf8"));


module.exports.run = (bot, message, args) => {
    //!warn @daeshan <reason>
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command, if you want to report someone use ${PR}${require("./report").help.usage}`);
    let wUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
    if (!wUser) return message.reply(`User not found, use: ${PR}${module.exports.help.usage}`);
    if (wUser.hasPermission("ADMINISTRATOR")) return message.reply("You can't warn this person, person is an administrator.");
    let reason = args.join(" ").slice(22);
    if (!reason) return message.reply(`Please add a reason, ${PR}${module.exports.help.usage}`)

    if (!warns[wUser.id])
        warns[wUser.id] = {
            warns: 0
        };

    warns[wUser.id].warns++;
    fs.writeFile("./jsonData/warnings.json", JSON.stringify(warns), err => {
        if (err) console.error(err)
    });


    const warnchannel = message.guild.channels.cache.find(x => x.name == warnChannelConfig || x.id == warnChannelConfig);
    if (!warnchannel) return message.reply(`Channel "${warnChannelConfig}" not found, ask a mod for help!`);

    warnchannel.send(new Discord.MessageEmbed()
        .setAuthor("Warn")
        .setThumbnail(wUser.user.displayAvatarURL())
        .setColor("#fc6400")
        .addField("Warned By", `<@${message.author.id}> `)
        .addField("Warned User", `<@${wUser.id}> `)
        .addField("Warned In", message.channel)
        .addField("Amount of warns", warns[wUser.id].warns)
        .addField("Reason", reason));

    if (warns[wUser.id].warns >= maxWarns) {

        warns[wUser.id].warns = 0;
        fs.writeFile("./jsonData/warnings.json", JSON.stringify(warns), err => {
            if (err) console.error(err)
        });
        warnchannel.send(`<@${wUser.id}> is kicked.`);
        message.reply(`<@${wUser.id}> is kicked.`);

        wUser.send(`Dear <@${wUser.id}>,\nYou're kicked from ${message.guild.name}, because you had the maximum number of warns: ${maxWarns}`)
            .then(() => {
                message.guild.member(wUser)
                    .kick(`you had the maximum number of warns: ${maxWarns}; Last Warn Reason: ${reason}`)
                    .catch(console.error);
            })
            .catch(console.error);

    } else if (warns[wUser.id].warns > 0) {
        if (wUser.roles.cache.find(x => x.name == roleName)) return message.reply(`<@${mUser.id}> was already muted.`)
        require("../extra/mute")(wUser)
            .then(muteRole => {
                message.reply(`Warned that user.\nAnd muted for ${warnMuteTime[warns[wUser.id].warns] || warnMuteTime[warnMuteTime.length - 1]}ms`);
                setTimeout(() => {
                    wUser.roles.remove(muteRole.id)
                        .then(() => { message.reply(`<@${wUser.id}> isn't muted anymore.`) })
                        .catch(console.error);
                }, warnMuteTime[warns[wUser.id].warns] || warnMuteTime[warnMuteTime.length - 1])
            })
            .catch(err => { message.reply(err) })
    }
}

module.exports.help = {
    name: "warn",
    description: "warn someone",
    administrator: true,
    usage: "warn @user <reason>"
}