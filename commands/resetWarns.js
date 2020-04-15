const Discord = require("discord.js");
const botconfig = require("../jsonData/botconfig.json");
const pr = botconfig.prefix;
const fs = require("fs");
let warns = JSON.parse(fs.readFileSync("./jsonData/warnings.json", "utf8"));
module.exports.run = async (bot, message, args) => {
    //!warn @daeshan <reason>
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command.`);
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if (!wUser) return message.reply(`User not found, use: ${pr}resetwarn @name`);

    if (!warns[wUser.id]) {
        message.reply(`This user was already clean`);
    }


    warns[wUser.id].warns = 0;

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err)
    });

    let warnEmbed = new Discord.MessageEmbed()
        .setAuthor("Reset Warns")
        .setTitle("By " + message.author.username)
        .setColor("#fc6400")
        .addField("Cleaned User", `<@${wUser.id}> `)
        .addField("Cleaned In", message.channel)
        .addField("Amount of warns", warns[wUser.id].warns);
    let warnchannel = message.guild.channels.find(x => x.name == botconfig.channels.warn || x.id == botconfig.channels.warn);
    if (!warnchannel) return message.reply(`Channel "${botconfig.channels.warn}" not found, ask a mod for help!`);

    warnchannel.send(warnEmbed);

}

module.exports.help = {
    name: "resetwarn",
    description: "Remove the amount of warns of someone !resetwarn @name",
    administrator: true,
    usage: "resetwarn @user"
}