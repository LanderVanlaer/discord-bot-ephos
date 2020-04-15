const Discord = require("discord.js");
const botconfig = require("../jsonData/botconfig.json");
const pr = botconfig.prefix;
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./jsonData/warnings.json", "utf8"));
module.exports.run = async (bot, message, args) => {
  //!warn @daeshan <reason>
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command, if you want to report someone use ${pr}report`);
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if (!wUser) return message.reply(`User not found, use: ${pr}warn @name <reason>`);
  if (wUser.hasPermission("ADMINISTRATOR")) return message.reply("You can't warn him, he's an administrator.");
  let reason = args.join(" ").slice(22);
  if (!reason) return message.reply(`Please add a reason, ${pr}warn @name <reason>`)

  //Delete extra friend rank
  // let Friend = message.guild.roles.find(`name`, "friend");
  // let hasRankFriend = false;
  // if (wUser.roles.has(Friend.id)) {
  //   hasRankFriend = true;
  // }

  if (!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  if (warns[wUser.id].warns > botconfig.maxWarns) {
    warns[wUser.id].warns = 0;
  }


  warns[wUser.id].warns++;

  fs.writeFile("./jsonData/warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  let warnEmbed = new Discord.MessageEmbed()
    .setAuthor("Warn")
    .setTitle("Door " + message.author.username)
    .setColor("#fc6400")
    .addField("Warned User", `<@${wUser.id}> `)
    .addField("Warned In", message.channel)
    .addField("Aantal Warns", warns[wUser.id].warns)
    .addField("Reden", reason);

  let warnchannel = message.guild.channels.find(x => x.name == botconfig.channels.warn || x.id == botconfig.channels.warn);
  if (!warnchannel) return message.reply(`Channel "${botconfig.channels.warn}" not found, ask a mod for help!`);

  warnchannel.send(warnEmbed);

  if (warns[wUser.id].warns > botconfig.maxWarns) {
    message.reply(`<@${wUser.id}> is banned.`);
    wUser.send("Dear " + wUser + ",");
    wUser.send(`You're banned by ${message.guild.name}, because you had the maximum number of warns: ${botconfig.maxWarns}`);
    setTimeout(() => {
      message.guild.member(wUser).ban(reason);
    }, 1000);
    return;
  } else if (warns[wUser.id].warns > 0) {
    let Member = message.guild.roles.find(x => x.name == botconfig.roles.basic || x.id == botconfig.roles.basic) || false;
    if (wUser.roles.has(Member.id)) {
      await (wUser.removeRole(Member.id).catch(console.error));

      //Delete extra friend rank
      // if (hasRankFriend) {
      //   wUser.removeRole(Friend.id).catch(console.error)
      // };

      message.channel.send(`<@${wUser.id}> is muted temporary.`);
      setTimeout(() => {
        wUser.addRole(Member.id).catch(console.error);
        return message.channel.send(`<@${wUser.id}> isn't muted anymore.`);
        //Delete extra friend rank
        // if (hasRankFriend) {
        //   wUser.addRole(Friend.id).catch(console.error)
        // };
      }, ms(botconfig.warnMuteTime[0]) || botconfig.warnMuteTime[botconfig.warnMuteTime.length - 1])
    } else return message.reply(`Warned that user.`);
  }
  return
}

module.exports.help = {
  name: "warn",
  description: "warn someone !warn @name reason",
  administrator: true,
  usage: "warn @user <reason>"
}