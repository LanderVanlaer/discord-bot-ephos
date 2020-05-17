const { prefix } = require("../jsonData/botconfig.json");

module.exports.run = (bot, message, args, isFromTimer) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command.`);
    const content = args.join(" ");
    if (!content) return message.reply(`Please add some content to say: ${prefix}${module.exports.help.usage}`);

    if (!isFromTimer)
        message.delete().catch(console.error);

    let possible = true;
    let JSON_CONTENT;
    try {
        JSON_CONTENT = JSON.parse(content);
    } catch (err) {
        possible = false;
    };
    if (possible) {
        if (typeof JSON_CONTENT == "object") {
            if (('embed' in JSON_CONTENT) && ('title' in JSON_CONTENT.embed) && !content.replace(/ /g, "").includes(`""`)) {
                try {
                    message.channel.send(JSON_CONTENT);
                } catch (error) {
                    message.reply("ERROR: Unable to do that.");
                }
                return;
            }
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