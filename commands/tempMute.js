const { MessageEmbed } = require("discord.js");
const { channels: { mute: logbook }, prefix: PR, } = require("../jsonData/botconfig.json");
const { GREY } = require("../jsonData/colors.json");


module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command.`);

    let [mentiondUser, duration, ...reason] = args;
    if (!mentiondUser || !duration || !reason) return message.reply(`Something went wrong. Use ${PR}${module.exports.help.usage}`);
    reason = reason.join(" ").trim();
    duration = Number(duration);
    if (!reason || !duration) return message.reply(`Something went wrong. Use ${PR}${module.exports.help.usage}`);

    const mUser = message.guild.member(message.mentions.users.first() || message.guild.member(mentiondUser));
    if (!mUser) return message.reply(`User not found, use: ${pr}${module.exports.help.usage}`);
    if (mUser.hasPermission("ADMINISTRATOR")) return message.reply("You can't mute this person, person is an administrator.");


    require("../extra/mute")(mUser)
        .then(muteRole => {
            message.reply(`Temporarily muted that user for ${duration}ms`);

            setTimeout(() => {
                mUser.roles
                    .remove(muteRole.id)
                    .then(() => { message.reply(`<@${mUser.id}> isn't muted anymore.`) })
                    .catch(console.error);
            }, duration);

            const logbookChannel = message.guild.channels.cache.find(x => x.id == logbook || x.name == logbook);
            if (!logbookChannel) return message.reply(`Channel "${logbook}" not found, ask a mod for help!`)

            logbookChannel.send(
                new MessageEmbed()
                .setThumbnail(mUser.user.displayAvatarURL())
                .setColor(GREY)
                .setAuthor("Temporarily mute")
                .addField("Muted By", `<@${message.author.id}> `)
                .addField("Muted User", `<@${mUser.id}> `)
                .addField("Muted In", message.channel)
                .addField("Duration of Mute", duration)
                .addField("Reason", reason)
            )
        })
        .catch(err => {
            message.reply(err);
            console.log(err);
        });
}

module.exports.help = {
    name: "tempmute",
    description: "Temporarily mute someone",
    administrator: true,
    usage: "tempmute @user <duration in milliseconds> <reason>"
}