const { MessageEmbed } = require("discord.js");
const { prefix: pr, directMessagesChannelCategory: dmcc } = require("../jsonData/botconfig.json");
const stopCommand = "stop";
const fs = require("fs");

module.exports = async (message, bot) => {

    const writeFile = () => {
        fs.writeFile("./jsonData/directMessage.json", JSON.stringify(activeChats, null, 2), err => {
            if (err) console.log(err)
        });
    }


    delete require.cache[require.resolve("../jsonData/directMessage.json")]; //delete from cache
    let activeChats = require("../jsonData/directMessage.json");


    let chat = activeChats.find(x => x.guildChannel.id == message.channel.id);
    if (!chat) return;
    const USER = bot.users.cache.find(x => x.id == chat.user);

    if (!USER) {
        activeChats = activeChats.filter(active => active.user !== chat.guildChannel.id);
        writeFile();
        return message.reply(`User <@${chat.user}>, not found, left the server. Remove this channel`);
    }



    if (!chat.moderators.some(x => x == message.author.id)) { //ADD MODERATOR
        activeChats = activeChats.map(c => {
            if (c.guildChannel.id == message.channel.id) {
                c.moderators.push(message.author.id);
            }
            return c;
        });
        chat = activeChats.find(x => x.guildChannel.id == message.channel.id);
        message.channel.setTopic(`Private chat with "${USER.tag}", these moderators have cooperated: [${chat.moderators.toString()}]`); //change topic
    }

    if (message.content == `${pr}${stopCommand}`) { //STOP
        activeChats = activeChats.filter(active => active.user !== USER.id);

        const embed = new MessageEmbed()
            .setTitle("Chat closed")
            .setColor("#A60000")
            .setThumbnail(USER.displayAvatarURL())
            .addField("Member", `<@!${USER.id}>`)
            .addField("Closed On", new Date());
        USER.send(embed);
        message.channel.send(embed);
        message.channel.send(`\`\`\`js\n${JSON.stringify(chat, null, 2)}\n\`\`\``);
        message.channel.setName(`✅${message.channel.name}`);
        message.channel.send(`Channel can be deleted`);
    } else { //send chat 
        const files = message.attachments.map(e => e.url)
        USER.send(message.content, { files });
    }
    writeFile();
}


// {
//     user: "23123036540",
//     guildChannel: {
//         id: "212631646",
//         name: "Chat with ..."
//     },
//     moderators: ["1263654651635"]
// }