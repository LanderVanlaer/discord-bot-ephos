const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const user = !message.mentions.users.size ? message.author : message.mentions.users.first();
    let botembed = new Discord.MessageEmbed()
        .setDescription(`[Avatar](${user.avatarURL()}) of ${user}`)
        .setColor("#EDBA13")
        .setImage(user.avatarURL());
    message.channel.send(botembed);
}

module.exports.help = {
    name: "avatar",
    description: "give your avatar (profile photo)",
    administrator: false,
    usage: "avatar"
}