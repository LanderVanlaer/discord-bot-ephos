const Discord = require("discord.js");
const botconfig = require("../jsonData/botconfig.json");

module.exports.run = async (bot, message, args) => {
  let bicon = bot.user.displayAvatarURL;
  let botembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Bot Name", bot.user.username)
    .addField("Created On", bot.user.createdAt)
    .addField("Created By", "@Lander Van laer#7819")
    .addField("Prefix", botconfig.prefix);
  message.channel.send(botembed);
}

module.exports.help = {
  name: "botinfo",
  description: "give some info about the bot",
  administrator: false,
  usage: "botinfo"
}