const { MessageEmbed } = require("discord.js");
const { prefix } = require("../jsonData/botconfig.json");

module.exports.run = async (bot, message, args) => {
    const botembed = new MessageEmbed()
        .setTitle("commands")
        .setDescription("```css\n@userNN : user Not Necessary```")
        // .addField("\u200B", "\u200B")
        .setColor("#15f153")
        .setThumbnail(bot.user.displayAvatarURL());
    const MEMBER_HAS_ADMINISTRATOR = message.member.hasPermission("ADMINISTRATOR");
    bot.commands.forEach(cmd => { //run, name, description, administrator
        if (cmd.help.administrator) {
            if (MEMBER_HAS_ADMINISTRATOR)
                botembed.addField(`__**${cmd.help.name}**__`, `${cmd.help.description}:\n\`${prefix}${cmd.help.usage}\``);
        } else botembed.addField(`__**${cmd.help.name}**__`, `${cmd.help.description}:\n\`${prefix}${cmd.help.usage}\``);
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