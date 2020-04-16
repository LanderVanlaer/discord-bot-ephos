const Discord = require("discord.js");
const BOT_CONFIG = require("../jsonData/botconfig.json");

module.exports.run = (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command.`);
    const content = args.join(" ");
    if (!content) return message.reply(`Please add some content to say: ${BOT_CONFIG.prefix}${module.exports.help.usage}`);
    message.delete().catch(console.error);
    let possible = true;
    let JSON_CONTENT;
    try {
        JSON_CONTENT = JSON.parse(content);
    } catch (err) {
        possible = false;
    };
    if (possible) {
        if (JSON_CONTENT.embed && JSON_CONTENT.embed.title && !content.replace(/ /g, "").includes(`""`)) {
            try {
                message.channel.send(JSON_CONTENT);
            } catch (error) {
                message.reply("ERROR: Unable to do that.");
            }
            return;
        }
    }
    message.channel.send(content);
}

module.exports.help = {
    name: "say",
    description: "say something as the bot; If you want an embed message, go to: https://leovoel.github.io/embed-visualizer/ and paste the left code",
    administrator: true,
    usage: "say <content>"
}