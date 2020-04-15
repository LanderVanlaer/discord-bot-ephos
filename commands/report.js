const Discord = require("discord.js");
const botconfig = require("../jsonData/botconfig.json");
module.exports.run = async (bot, message, args) => {
  let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!rUser) return message.reply("I didn't find that user, !report @name <reason>");
  let reason = args.join(" ").slice(22);
  if (!reason) return message.reply("Please give reason, !report @name <reason>");

  let reportEmbed = new Discord.MessageEmbed()
    .setDescription("REPORT")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} With Id: ${rUser.id}`)
    .addField("Reported By", `${message.author} With Id: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("When", message.createdAt)
    .addField("Reason", reason);
  let reportEmbedPrivate = new Discord.MessageEmbed()
    .setDescription("REPORT")
    .setColor("#15f153")
    .addField("Reported User ", `${rUser} With Id: ${rUser.id}`)
    .addField("When", message.createdAt)
    .addField("Reason", reason);

  let reportschannel = message.guild.channels.find(x => x.name == botconfig.channels.report || x.id == botconfig.channels.report);
  if (!reportschannel) return message.channel.send(`I didn't find the report-channel "${botconfig.channels.report}, ask a mod for help"`);

  message.delete().catch(O_o => {});
  reportschannel.send(reportEmbed);
  message.author.send("Dear " + message.author + ",");
  message.author.send("we received your message well");
  message.author.send("We'll look into it, we may also contact you for evidence.");
  message.author.send(reportEmbedPrivate);
  return;
}

module.exports.help = {
  name: "report",
  description: "report someone: !report @name <reason>",
  administrator: false,
  usage: "report @name <reason>"
}