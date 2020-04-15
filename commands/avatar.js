const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let botembed = new Discord.RichEmbed()
        .setDescription(`[Avatar](${message.author.avatarURL}) of ${message.author}`)
        .setColor("#EDBA13")
        .setImage(message.author.avatarURL);
    message.channel.send(botembed);
}

module.exports.help = {
    name: "avatar",
    description: "give your avatar (profile photo)",
    administrator: false,
    usage: "avatar"
}