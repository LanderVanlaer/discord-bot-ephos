const Discord = require("discord.js");
const botconfig = require("../jsonData/botconfig.json");
module.exports.run = async (bot, reaction, user) => {
    const role = botconfig.roles[botconfig.messageReactionAdd.rulesVerification.role];
    reaction.message.guild.member(user).addRole(reaction.message.guild.roles.find(x => x.name == role || x.id == role))
}

module.exports.help = {
    name: "rulesVerification",
    description: "give the basic role",
    administrator: false
}