const Discord = require("discord.js");
const { prefix, channels: { reportChannel } } = require("../jsonData/botconfig.json");

module.exports.run = async (bot, message, args) => {
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
    if (!rUser) return message.reply("I didn't find that user, !report @name <reason>");
    let reason = args.join(" ").slice(22);
    if (!reason) return message.reply(`Please give reason, ${prefix}${module.exports.help.usage}`);

    let reportEmbed = new Discord.MessageEmbed()
        .setThumbnail(rUser.user.displayAvatarURL())
        .setColor("#15f153")
        .setDescription("REPORT")
        .addField("Reported User", `${rUser} With Id: ${rUser.id}`)
        .addField("Reported By", `${message.author} With Id: ${message.author.id}`)
        .addField("Channel", message.channel)
        .addField("When", message.createdAt)
        .addField("Reason", reason);

    let reportschannel = message.guild.channels.cache.find(x => x.name == reportChannel || x.id == reportChannel);
    if (!reportschannel) return message.channel.send(`I didn't find the report-channel "${reportChannel}, ask a mod for help"`);

    message.delete().catch(console.error);
    reportschannel.send(reportEmbed);

    message.author.send(
        `Dear <@${message.author.id}>,
    we received your message well
    We'll look into it, we may also contact you for evidence.`
    );
    message.author.send(reportEmbed);
    return;
}

module.exports.help = {
    name: "report",
    description: "report someone",
    administrator: false,
    usage: "report @name <reason>"
}