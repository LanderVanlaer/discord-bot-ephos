const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.MessageEmbed()
        .setDescription("commands")
        .setColor("#15f153")
        .setThumbnail(bicon);
    bot.commands.forEach((value, key) => { //run, name, description, administrator
        if (value.help.administrator) {
            if (message.member.hasPermission("ADMINISTRATOR")) {
                botembed.addField(value.help.name, value.help.description);
            };
        } else {
            botembed.addField(value.help.name, value.help.description);
        }
    });
    message.channel.send(botembed);
}

module.exports.help = {
    name: "help",
    description: "give all commands",
    administrator: false,
    usage: "help"
}