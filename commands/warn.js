const { MessageEmbed } = require("discord.js"), { channels: { warn: warnChannelConfig }, maxWarns, prefix: PR, warnMuteTime, roles: { muteRole: roleName }, permissions: { warn: warnPermissions } } = require("../jsonData/botconfig.json"),
    fs = require("fs");


module.exports.run = (bot, message, args) => {
    // message.reply(`You're not allowed to use that command, if you want to report someone use ${PR}${require("./report").help.usage}`)

    let wUser = message.guild.members.cache.find(x => `<@!${x.id}>` == args[0]);
    if (!wUser) return message.reply(`User not found, use: ${PR}${module.exports.help.usage}`);

    if (require('../extra/hasPermissionOrRole')(wUser, warnPermissions))
        return message.reply(`You can't warn this person, person is an administrator.`)

    let reason = args.join(" ").slice(22);
    if (!reason) return message.reply(`Please add a reason, ${PR}${module.exports.help.usage}`)

    let warns = JSON.parse(fs.readFileSync("./jsonData/warnings.json", "utf8"));

    if (!warns[wUser.id])
        warns[wUser.id] = {
            warns: 0,
            reasons: []
        };

    warns[wUser.id].warns++;
    warns[wUser.id].reasons.push(reason);


    const warnchannel = message.guild.channels.cache.find(x => x.name == warnChannelConfig || x.id == warnChannelConfig);
    if (!warnchannel) return message.reply(`Channel "${warnChannelConfig}" not found, ask a mod for help!`);

    warnchannel.send(new MessageEmbed()
        .setAuthor("Warn")
        .setThumbnail(wUser.user.displayAvatarURL())
        .setColor("#fc6400")
        .addField("Warned By", `<@${message.author.id}> `)
        .addField("Warned User", `<@${wUser.id}> `)
        .addField("Warned In", message.channel)
        .addField("Amount of warns", warns[wUser.id].warns)
        .addField("Reason", reason));

    if (warns[wUser.id].warns >= maxWarns) {

        warns[wUser.id] = {
            warns: 0,
            reasons: []
        }

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
        if (wUser.roles.cache.find(x => x.name == roleName)) return message.reply(`<@${wUser.id}> was already muted.`)
        require("../extra/mute")(wUser)
            .then(muteRole => {
                message.reply(`Warned that user.\nAnd muted for ${warnMuteTime[warns[wUser.id].warns] || warnMuteTime[warnMuteTime.length - 1]}ms`);
                setTimeout(() => {
                    wUser.roles.remove(muteRole.id)
                        .then(() => { message.reply(`<@${wUser.id}> isn't muted anymore.`) })
                        .catch(e => {
                            if (e.code == 10007) return;
                            else console.error(e)
                        });
                }, warnMuteTime[warns[wUser.id].warns] || warnMuteTime[warnMuteTime.length - 1])
            })
            .catch(err => { message.reply(err) })
    }
    fs.writeFile("./jsonData/warnings.json", JSON.stringify(warns, null, 2), err => {
        if (err) console.error(err)
    });
}

module.exports.help = {
    name: "warn",
    description: "warn someone",
    administrator: true,
    usage: "warn @user <reason>"
}