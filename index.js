const BOT_CONFIG = require("./jsonData/botconfig.json");
const COLORS = require("./jsonData/colors.json");
const fs = require("fs");
const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEveryone: true
});
bot.commands = new Discord.Collection();
bot.reactionsAdd = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.log(err);

  let jsfiles = files.filter(f => f.split(".").pop() === "js");

  if (jsfiles.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }
  console.log(`\n------COMMANDS------`);
  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${i}.  ${f}`);
    bot.commands.set(props.help.name, props);
  });
})

fs.readdir("./messageReactionAdd/", (err, files) => {
  if (err) return console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");

  if (jsfile.length <= 0) {
    console.log("Couldn't find messageReactionAdd Files.");
    return;
  }

  console.log(`\n------messageReactionAdd------`);
  jsfile.forEach((f, i) => {
    let props = require(`./messageReactionAdd/${f}`);
    console.log(`${i}.  ${f}`);
    bot.reactionsAdd.set(props.help.name, props);
  });
})




//--------------------------------------------------------------------------------------------------------------------------
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);
  bot.user.setActivity(BOT_CONFIG.activityText, {
    type: BOT_CONFIG.activityType
  });
});


bot.on("message", message => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;


  if (!message.member.hasPermission("ADMINISTRATOR")) {
    const linkRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/i;
    if (linkRegex.test(message.content)) {
      message.guild.fetchInvites().then(invites => {
        if (!invites.some(x => message.content.includes(x.code))) {
          message.delete().catch(console.error);
          message.reply(`You're not allowed to invite people for other servers!!!`).then(msg => msg.delete({
            timeout: 10000
          })).catch(console.error);
          message.guild.channels.cache.find(x => x.name == BOT_CONFIG.channels.logbook || x.id == BOT_CONFIG.channels.logbook)
            .send(new Discord.MessageEmbed()
              .setTitle("Send Discord Invite")
              .addField("By", `${message.author} With Id: ${message.author.id}`)
              .addField("Channel", message.channel)
              .addField("Created At", message.createdAt)
              .addField("Content", message.content)
              .setColor("#7289DA")
            );
        }
      })
    }
  }

  const
    messageArray = message.content.split(" "),
    cmd = messageArray[0],
    args = messageArray.slice(1),
    commandfile = bot.commands.get(cmd.slice(BOT_CONFIG.prefix.length));
  if (commandfile) commandfile.run(bot, message, args);
});

bot.on('guildMemberAdd', require("./extra/welcome"));

bot.on('messageReactionAdd', (reaction, user) => {
  // reaction.message.channel.send(reaction._emoji.name.toString());

  if (reaction.message.author.bot) return;
  if (reaction.message.channel.type === "dm") return;
  for (const a in BOT_CONFIG.messageReactionAdd) {
    if (BOT_CONFIG.messageReactionAdd[a].messageId == reaction.message.id) {
      return bot.reactionsAdd.get(a).run(bot, reaction, user);
    }
  }
  return;

  /* 
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, reaction);
  */
})




bot.on('guildBanAdd', (guild, user) => {
  guild.channels.cache.find(x => x.name == BOT_CONFIG.channels.banKick || x.id == BOT_CONFIG.channels.banKick).send({
    embed: new Discord.MessageEmbed()
      .setTitle("BAN")
      .setColor("#F04747")
      .addField("Name", user.tag)
      .addField("Id", user.id)
      .setThumbnail(user.displayAvatarURL())
  });
})
bot.on('guildBanRemove', (guild, user) => {
  guild.channels.cache.find(x => x.name == BOT_CONFIG.channels.banKick || x.id == BOT_CONFIG.channels.banKick).send({
    embed: new Discord.MessageEmbed()
      .setTitle("UNBAN")
      .setColor("#10A33A")
      .addField("Name", user.tag)
      .addField("Id", user.id)
      .setThumbnail(user.displayAvatarURL())
  });
})

bot.on('messageDelete', message => {
  message.guild.channels.cache.find(x => x.name == BOT_CONFIG.channels.logbook || x.id == BOT_CONFIG.channels.logbook).send({
    embed: new Discord.MessageEmbed()
      .setTitle("MESSAGE DELETE")
      .setColor("#2196F3")
      .addField("Name", message.author.tag)
      .addField("Tag", `<@${message.author.id}>`)
      .addField("Id", message.author.id)
      .addField("Deleted Message", message.content)
      .setThumbnail(message.author.displayAvatarURL())
  }).catch(console.error);
})

bot.on('messageUpdate', (oldMessage, newMessage) => {
  if (!newMessage.content) return;
  newMessage.guild.channels.cache.find(x => x.name == BOT_CONFIG.channels.logbook || x.id == BOT_CONFIG.channels.logbook).send({
    embed: new Discord.MessageEmbed()
      .setTitle("MESSAGE EDIT")
      .setColor("#2196F3")
      .addField("Name", newMessage.author.tag)
      .addField("Tag", `<@${newMessage.author.id}>`)
      .addField("Id", newMessage.author.id)
      .addField("From Message Content", `${oldMessage.content} `)
      .addField("To Message Content", `${newMessage.content} `)
      .setThumbnail(newMessage.author.displayAvatarURL())
  }).catch(console.error);
})


//if message isn't in cachge, 'place it in cache'.
bot.on('raw', packet => {
  // We don't want this to run on unrelated packets
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  // Grab the channel to check the messag efrom
  const channel = bot.channels.get(packet.d.channel_id);
  // There's no need to emit if the message is cached, because the event will fire anyway for that
  if (channel.messages.has(packet.d.message_id)) return;
  // Since we have confirmed the message is not cached, let's fetch it
  channel.fetchMessage(packet.d.message_id).then(message => {
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
    // This gives us the reaction we need to emit the event properly, in top of the message object
    const reaction = message.reactions.get(emoji);
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction) reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id));
    // Check which type of event it is before emitting
    if (packet.t === 'MESSAGE_REACTION_ADD') {
      bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id));
    }
    if (packet.t === 'MESSAGE_REACTION_REMOVE') {
      bot.emit('messageReactionRemove', reaction, bot.users.get(packet.d.user_id));
    }
  });
});



bot.login(BOT_CONFIG.token);


//___________________________________________________________________________________________________________________________________________________________________________________________________________________
/*
https://discordapp.com/oauth2/authorize?client_id=658289707695865876&scope=bot
*/