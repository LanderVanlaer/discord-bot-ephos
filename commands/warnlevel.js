const { maxWarns } = require("../jsonData/botconfig.json");
const fs = require("fs");
let warns = JSON.parse(fs.readFileSync("./jsonData/warnings.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    //if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("U hebt hier geen rechten voor!");
    let wUser = message.guild.member(message.mentions.users.first());
    if (!wUser) return message.reply("That user hasn't been signaled to us yet, or there's a spelling error");

    let warnlevel = warns[wUser.id];
    if (!warnlevel) return message.reply("That user hasn't been signaled to us yet, or there's a spelling error");
    message.reply(`<@${wUser.id}> has ${warnlevel.warns} warnings. The max of warns is ${maxWarns}`);
}

module.exports.help = {
    name: "warnlevel",
    description: "give the amount of warns of someone",
    administrator: false,
    usage: "warnlevel @name"
}