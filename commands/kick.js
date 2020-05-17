const { MessageEmbed } = require("discord.js");
const { prefix: PR } = require("../jsonData/botconfig.json");
const { channels: { banKick }, permissions: { kick: kickPermissions } } = require("../jsonData/botconfig.json");

module.exports.run = async (bot, message, args) => {
    const kUser = message.guild.members.cache.find(x => `<@!${x.id}>` == args[0]);
    if (!kUser) return message.reply(`User not found, use: ${PR}${module.exports.help.usage}`);
    if (require('../extra/hasPermissionOrRole')(kUser, kickPermissions))
        return message.reply(`You can't kick this person, person is an admin.`)
    const reason = args.join(" ").slice(22);
    if (!reason) return message.reply(`Please add a reason, ${PR}${module.exports.help.usage}`)

    message.reply(`<@${kUser.id}> is kicked from the server`);
    message.delete().catch(console.error);

    const kickChannel = message.guild.channels.cache.find(x => x.name == banKick || x.id == banKick);
    if (!kickChannel) return message.reply(`Channel "${banKick}" not found, ask a mod for help!`);
    const embed =
        new MessageEmbed()
        .setAuthor("Kick")
        .setThumbnail(kUser.user.displayAvatarURL())
        .setColor("#F04747")
        .addField("Kicked User", `<@${kUser.id}> `)
        .addField("Kicked In", message.channel)
        .addField("Reason", reason);

    await kUser.send({ content: `You're kicked from the server **${message.guild.name}**`, embed });
    kUser.kick(reason).catch(console.error);

    embed.addField("Kicked By", `<@${message.author.id}> `)
    kickChannel.send(embed).then();
}

module.exports.help = {
    name: "kick",
    description: "Kick a person",
    administrator: true,
    usage: "kick @user <reason>"
}