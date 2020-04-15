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


bot.on("message", async message => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;


  if (!message.member.hasPermission("ADMINISTRATOR")) {
    const linkRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/i;
    if (linkRegex.test(message.content)) {
      await message.delete().catch(O_o => {});
      message.reply(`You're not allowed to invite people for other servers!!!`).then(msg => msg.delete(10000)).catch(console.error);
      message.guild.channels.find(x => x.name == BOT_CONFIG.channels.logbook || x.id == BOT_CONFIG.channels.logbook)
        .send({
          embed: new Discord.MessageEmbed()
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

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  const args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(BOT_CONFIG.prefix.length));
  if (commandfile) commandfile.run(bot, message, args);
});

bot.on('guildMemberAdd', async member => {
  // var role = member.guild.roles.find('name', BOT_CONFIG.roles.basic);
  // member.addRole(role);
  let welcomeEmbed = {
    content: '\u200B',
    color: COLORS.DARK_BLUE,
    thumbnail: {
      url: member.guild.iconURL
    },
    title: member.guild.name,
    description: `[Click here to check our site!](${BOT_CONFIG.website})`,
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
        value: await fs.readFile("jsonData/welcomeMessage.txt")
      }
    ],
    footer: {
      text: '*React with* :ballot_box_with_check: *or type !verify to unlock the server.*'
    },
    image: {
      url: "https://lh3.googleusercontent.com/HdXLBC4CwPoe0CB_qULCsO3sUkLAxJloow4tRwQPi1x0vUs_ox92NPSa8bgo4UhVE5zOpzndeTevLw=w1920-h969-rw"
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
  let embed = new Discord.MessageEmbed()
    .setTitle("BAN")
    .setColor("#F04747")
    .addField("Name", user.tag)
    .addField("Id", user.id)
    .setThumbnail(user.avatarURL);

  guild.channels.find(x => x.name == BOT_CONFIG.channels.banKick || x.id == BOT_CONFIG.channels.banKick).send({
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



bot.login(BOT_CONFIG.token);


//___________________________________________________________________________________________________________________________________________________________________________________________________________________
/*
https://discordapp.com/oauth2/authorize?client_id=658289707695865876&scope=bot
*/