const botconfig = require("./jsonData/botconfig.json");
const colors = require("./jsonData/colors.json");
const fs = require("fs");
const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEveryone: true
});
bot.commands = new Discord.Collection();
bot.reactionsAdd = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");

  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }
  console.log(`\n------COMMANDS------`);
  jsfile.forEach((f, i) => {
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
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  bot.user.setActivity(botconfig.activityText, {
    type: botconfig.activityType
  });
});
bot.on("message", async message => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;


  if (!message.member.hasPermission("ADMINISTRATOR")) {
    const linkRegex = /d?.{0,4}i?.{0,4}s.{0,4}c.{0,4}o.{0,4}r.{0,4}d?.{0,4}\..{0,4}g.{0,4}g.{0,4}\/|d?.{0,4}i?.{0,4}s.{0,4}c.{0,4}o.{0,4}r.{0,4}d?.{0,4}a.{0,4}p?.{0,4}p?.{0,4}\..{0,4}c.{0,4}o.{0,4}m.{0,4}\/.{0,4}i.{0,4}n.{0,4}v.{0,4}i.{0,4}t.{0,4}e.{0,4}\//i;
    if (linkRegex.test(message.content)) {
      await message.delete().catch(O_o => {});
      message.reply(`You're not allowed to invite people for other servers!!!`).then(msg => msg.delete(10000)).catch(console.error);
      message.guild.channels.find(x => x.name == botconfig.channels.logbook || x.id == botconfig.channels.logbook)
        .send({
          embed: new Discord.RichEmbed()
            .setTitle("Send Discord Invite")
            .addField("By", `${message.author} With Id: ${message.author.id}`)
            .addField("Channel", message.channel)
            .addField("Created At", message.createdAt)
            .addField("Content", message.content)
            .setColor("#7289DA")
        });
      return
    }
  }

  const prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  const args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(bot, message, args);
});

bot.on('guildMemberAdd', member => {
  // var role = member.guild.roles.find('name', botconfig.roles.basic);
  // member.addRole(role);
  let welcomeEmbed = {
    content: '\u200B',
    color: colors.DARK_BLUE,
    thumbnail: {
      url: member.guild.iconURL
    },
    title: member.guild.name,
    description: `[Click here to check our site!](${botconfig.website})`,
    fields: [{
        name: 'About',
        inline: false,
        value: `Welcome on the **${member.guild.name}** server\nThere are now ${member.guild.members.filter(member => !member.user.bot).size} players in total on the server.\nTalk, chat and game!`
      },
      {
        name: '\u200B',
        inline: false,
        value: '\u200B'
      }, {
        name: '\u200B',
        inline: false,
        value: `
          _**BEFORE YOU CONTINUE, PLEASE READ THE RULES TO AVOID POSSIBLE CONFLICTS**_

          :warning: *Any questions or concerns regarding the rules can be discussed with a staff member.*

          ━━━━━━━━━━━━━━━━━━━━

          **1) MUTUAL RESPECT is valued.**

          **2) Only ADVERTISE with a MANAGERS CONSENT.**

          **3) NO discussing or encouraging possibly OFFENSIVE, ILLEGAL or VIOLATING CONTENT AND BEHAVIOR.**
          **Everything harming the Discord ToS falls into this category as well.**

          **4) The IMPERSONATION of _any__ member will NOT be condoned.**

          **5) ADMINISTRATIONAL ACTIONS are FINAL and should only done by staff members. (no minimodding)**

          **6) NO BAN and PUNISHMENT EVASIONS.**

          ━━━━━━━━━━━━━━━━━━━━`
      }
    ],
    footer: {
      text: '*Once you have read the rules type !verify to unlock the server.*'
    },
    image: {
      url: "https://cdn.discordapp.com/attachments/657206419459670026/660113462017523781/image0.jpg"
    }
  }
  member.send({
    embed: welcomeEmbed
  }).catch(err => {
    console.log(err)
  });
})

bot.on('messageReactionAdd', (reaction, user) => {
  // reaction.message.channel.send(reaction._emoji.name.toString());

  if (reaction.message.author.bot) return;
  if (reaction.message.channel.type === "dm") return;
  for (const a in botconfig.messageReactionAdd) {
    if (botconfig.messageReactionAdd[a].messageId == reaction.message.id) {
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
  let embed = new Discord.RichEmbed()
    .setTitle("BAN")
    .setColor("#F04747")
    .addField("Name", user.tag)
    .addField("Id", user.id)
    .setThumbnail(user.avatarURL);

  guild.channels.find(x => x.name == botconfig.channels.banKick || x.id == botconfig.channels.banKick).send({
    embed: embed
  });

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



bot.login(botconfig.token);


//___________________________________________________________________________________________________________________________________________________________________________________________________________________
/*
https://discordapp.com/oauth2/authorize?client_id=658289707695865876&scope=bot
*/