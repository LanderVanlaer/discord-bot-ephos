const Discord = require("discord.js");
const { prefix: pr, channels: { warn: warnChannel } } = require("../jsonData/botconfig.json");
const fs = require("fs");
let warns = JSON.parse(fs.readFileSync("./jsonData/warnings.json", "utf8"));
module.exports.run = async (bot, message, args) => {
    //!warn @daeshan <reason>
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command.`);
    const wUser = message.guild.members.cache.find(x => `<@!${x.id}>` == args[0]);
    if (!wUser) return message.reply(`User not found, use: ${pr}${module.exports.help.usage}`);

    if (!warns[wUser.id]) {
        return message.reply(`This user was already clean`);
    }

    const AMOUNT_OF_WARNS_REMOVED = warns[wUser.id].warns;

    warns[wUser.id].warns = 0;

    fs.writeFile("./jsonData/warnings.json", JSON.stringify(warns), err => {
        if (err) console.log(err)
    });

    const warnchannel = message.guild.channels.cache.find(x => x.name == warnChannel || x.id == warnChannel);
    if (!warnchannel) return message.reply(`Channel "${warnChannel}" not found, ask a mod for help!`);

    warnchannel.send(
        new Discord.MessageEmbed()
        .setColor("#fc6400")
        .setAuthor("Reset Warns")
        .addField("Warns removed By", `<@${message.author.id}> `)
        .addField("Cleaned User", `<@${wUser.id}> `)
        .addField("Cleaned In", message.channel)
        .addField("Amount of warns removed", AMOUNT_OF_WARNS_REMOVED)
    );
    message.delete().catch(console.error);
}

module.exports.help = {
    name: "resetwarn",
    description: "Remove the amount of warns of someone",
    administrator: true,
    usage: "resetwarn @user"
}