const Discord = require("discord.js");
const botconfig = require("../jsonData/botconfig.json");
const pr = botconfig.prefix;
const fs = require("fs");
let warns = JSON.parse(fs.readFileSync("./jsonData/warnings.json", "utf8"));
module.exports.run = async (bot, message, args) => {
    //!warn @daeshan <reason>
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command.`);
    const wUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
    if (!wUser) return message.reply(`User not found, use: ${pr}${module.exports.help.usage}`);

    if (!warns[wUser.id]) {
        return message.reply(`This user was already clean`);
    }

    const AMOUNT_OF_WARNS_REMOVED = warns[wUser.id].warns;

    warns[wUser.id].warns = 0;

    fs.writeFile("./jsonData/warnings.json", JSON.stringify(warns), err => {
        if (err) console.log(err)
    });

    const warnchannel = message.guild.channels.cache.find(x => x.name == botconfig.channels.warn || x.id == botconfig.channels.warn);
    if (!warnchannel) return message.reply(`Channel "${botconfig.channels.warn}" not found, ask a mod for help!`);

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