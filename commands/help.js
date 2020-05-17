const { MessageEmbed } = require("discord.js");
const { prefix, permissions } = require("../jsonData/botconfig.json");
const hasPermission = require('../extra/hasPermissionOrRole');

module.exports.run = async (bot, message, args) => {
    const botembed = new MessageEmbed()
        .setTitle("commands")
        .setDescription("```css\n@userNN : user Not Necessary```")
        .setColor("#15f153")
        .setThumbnail(bot.user.displayAvatarURL());

    const addToBotembed = ({ administrator, name, description, usage }) => {
        botembed.addField(`__**${name}**__`, `${description}:\n\`${prefix}${usage}\``);
    }

    bot.commands.forEach(({ help }) => { //run, name, description, administrator
        if (help.administrator) {
            if (hasPermission(message.member, permissions[help.name]))
                addToBotembed(help);
        } else addToBotembed(help);
    });
    await message.author.send(botembed);
    message.delete().catch(console.error)
}

module.exports.help = {
    name: "help",
    description: "give all commands",
    administrator: false,
    usage: "help"
}