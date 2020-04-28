const { MessageEmbed } = require("discord.js");
const { prefix: pr, directMessagesChannelCategory: dmcc } = require("../jsonData/botconfig.json");
const [startCommand, stopCommand] = ["start", "stop"];
const fs = require("fs");

module.exports = async (message, bot) => {
    delete require.cache[require.resolve("../jsonData/directMessage.json")]; //delete from cache
    let activeChats = require("../jsonData/directMessage.json")
    const
        member = message.author,
        chat = activeChats.find(x => x.user == member.id),
        guild = bot.guilds.cache.first();
    if (!chat) {
        if (message.content == `${pr}${startCommand}`) { //start
            //Channel create
            const CATEGORY = guild.channels.cache.find(x => x.id == dmcc || x.name == dmcc)

            const CHANNEL = await guild.channels.create(member.tag.split(" ").join("_"), {
                type: 'text',
                topic: `Private chat with "${member.tag}", these moderators have cooperated: [${[].toString()}]`, //text aboce channel
                parent: CATEGORY
            });

            //push data to json
            activeChats.push({
                user: member.id,
                guildChannel: {
                    id: CHANNEL.id
                },
                moderators: []
            });

            await fs.writeFile("./jsonData/directMessage.json", JSON.stringify(activeChats, null, 2), err => {
                if (err) console.log(err)
            });

            const embed = new MessageEmbed()
                .setTitle("Chat opened")
                .setColor("#15f153")
                .setThumbnail(member.displayAvatarURL())
                .addField("Member", `<@!${member.id}>`)
                .addField("Opened On", new Date());
            message.channel.send(embed);
            message.channel.send(`Now you can send messages to our moderators, they will try to answer as soon as possible. If you want to quit the chat, type \`${pr}${stopCommand}\``);
            CHANNEL.send(embed);
            CHANNEL.send(`When the conversation is over, type \`${pr}${stopCommand}\``);

        } else await message.reply(`if you want to start a chat with our moderators, type: \`${pr}start\``);
    } else if (message.content == `${pr}${stopCommand}`) { //STOP
        const CHAT = activeChats.find(x => x.user == member.id);
        const CHANNEL = guild.channels.cache.find(x => x.id == CHAT.guildChannel.id);

        activeChats = activeChats.filter(active => active.user !== member.id);
        fs.writeFile("./jsonData/directMessage.json", JSON.stringify(activeChats, null, 2), err => {
            if (err) console.log(err)
        });

        const embed = new MessageEmbed()
            .setTitle("Chat closed")
            .setColor("#A60000")
            .setThumbnail(member.displayAvatarURL())
            .addField("Member", `<@!${member.id}>`)
            .addField("Closed On", new Date());
        message.channel.send(embed);
        CHANNEL.send(embed);
        CHANNEL.send(`\`\`\`js\n${JSON.stringify(CHAT, null, 2)}\n\`\`\``);
        CHANNEL.send(`Channel can be deleted`);
        CHANNEL.setName(`✅${CHANNEL.name}`);
    } else { //send chat 
        const CHAT = activeChats.find(x => x.user == member.id);
        const CHANNEL = guild.channels.cache.find(x => x.id == CHAT.guildChannel.id);
        const files = message.attachments.map(e => e.url)

        if (!CHANNEL) {
            message.reply(`Something went wrong, please start a new chat`);
            activeChats = activeChats.filter(active => active.guildChannel.id !== CHAT.guildChannel.id);
            fs.writeFile("./jsonData/directMessage.json", JSON.stringify(activeChats, null, 2), err => {
                if (err) console.log(err)
            });
        } else
            CHANNEL.send(message.content, { files });
    }
}


// {
//     user: "23123036540",
//     guildChannel: {
//         id: "212631646",
//     },
//     moderators: ["1263654651635"]
// }