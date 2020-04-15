const Discord = require("discord.js");
const BOT_CONFIG = require("../jsonData/botconfig.json");

module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.MessageEmbed()
        .setTitle("commands")
        .setDescription("@userNN = user Not Necessary")
        .addField("\u200B", "\u200B")
        .setColor("#15f153")
        .setThumbnail(bicon);
    const MEMBER_HAS_ADMINISTRATOR = message.member.hasPermission("ADMINISTRATOR");
    bot.commands.forEach(cmd => { //run, name, description, administrator
        if (cmd.help.administrator) {
            if (MEMBER_HAS_ADMINISTRATOR)
                botembed.addField(`__**${cmd.help.name}**__`, `${cmd.help.description}:\n\`${BOT_CONFIG.prefix}${cmd.help.usage}\``);
        } else botembed.addField(`__**${cmd.help.name}**__`, `${cmd.help.description}:\n\`${BOT_CONFIG.prefix}${cmd.help.usage}\``);
    });
    message.channel.send(botembed);
}

module.exports.help = {
    name: "help",
    description: "give all commands",
    administrator: false,
    usage: "help"
}