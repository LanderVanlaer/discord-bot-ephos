const Discord = require("discord.js");
const botconfig = require("../jsonData/botconfig.json");
const PR = botconfig.prefix;
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./jsonData/warnings.json", "utf8"));
module.exports.run = (bot, message, args) => {
    //!warn @daeshan <reason>
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command, if you want to report someone use ${PR}report`);
    let wUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
    if (!wUser) return message.reply(`User not found, use: ${PR}warn @name <reason>`);
    if (wUser.hasPermission("ADMINISTRATOR")) return message.reply("You can't warn him, he's an administrator.");
    let reason = args.join(" ").slice(22);
    if (!reason) return message.reply(`Please add a reason, ${PR}warn @name <reason>`)

    if (!warns[wUser.id])
        warns[wUser.id] = {
            warns: 0
        };

    warns[wUser.id].warns++;
    fs.writeFile("./jsonData/warnings.json", JSON.stringify(warns), err => {
        if (err) console.error(err)
    });


    const warnchannel = message.guild.channels.cache.find(x => x.name == botconfig.channels.warn || x.id == botconfig.channels.warn);
    if (!warnchannel) return message.reply(`Channel "${botconfig.channels.warn}" not found, ask a mod for help!`);

    warnchannel.send(new Discord.MessageEmbed()
        .setAuthor("Warn")
        .setColor("#fc6400")
        .addField("Warned By", `<@${message.author.id}> `)
        .addField("Warned User", `<@${wUser.id}> `)
        .addField("Warned In", message.channel)
        .addField("Amount of warns", warns[wUser.id].warns)
        .addField("Reason", reason));

    if (warns[wUser.id].warns >= botconfig.maxWarns) {

        warns[wUser.id].warns = 0;
        fs.writeFile("./jsonData/warnings.json", JSON.stringify(warns), err => {
            if (err) console.error(err)
        });
        warnchannel.send(`<@${wUser.id}> is banned.`);
        message.reply(`<@${wUser.id}> is banned.`);

        wUser.send(`Dear <@${wUser.id}>,\nYou're banned from ${message.guild.name}, because you had the maximum number of warns: ${botconfig.maxWarns}`)
            .then(() => {
                message.guild.member(wUser).ban({
                    reason: `you had the maximum number of warns: ${botconfig.maxWarns}; Last Warn Reason: ${reason}`
                }).catch(console.error);
            })
            .catch(console.error);

    } else if (warns[wUser.id].warns > 0) {
        const MemberRole = message.guild.roles.cache.find(x => x.name == botconfig.roles.basic || x.id == botconfig.roles.basic) || false;
        if (MemberRole) {
            if (wUser.roles.cache.some(x => x.id == MemberRole.id)) {
                wUser.roles.remove(MemberRole.id).catch(console.error);

                message.channel.send(`<@${wUser.id}> is muted temporary.`);

                setTimeout(() => {
                    wUser.roles.add(MemberRole.id).catch(console.error);
                    message.channel.send(`<@${wUser.id}> isn't muted anymore.`);
                }, botconfig.warnMuteTime[warns[wUser.id].warns] || botconfig.warnMuteTime[botconfig.warnMuteTime.length - 1])

            } else
                message.reply(`Warned that user.`);
        }
    }
}

module.exports.help = {
    name: "warn",
    description: "warn someone",
    administrator: true,
    usage: "warn @user <reason>"
}