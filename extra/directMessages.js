module.exports = async message => {
    const activeChats = require("../jsonData/directMessage.json");
    const member = message.author;
    const chat = activeChats.find(x => x.user == member.id)
    if (!chat) {
        const startMessage = await message.reply(`if you want to start a chat with our moderators, press the emoji below`);
        await startMessage.react("✅")

        //create collector
        const collector = startMessage.createReactionCollector(x => {
            console.log(x.emoji.name);
            return true
            return x.emoji.name == "✅";
        }, { time: 5000 })

        collector.on('collect', (r, collector) => {
            console.log("collected");
        })

        collector.on('end', r => {
            console.table(r)
        })

    }
}


// {
//     user: "23123036540",
//     guildChannel: {
//         id: "212631646",
//         name: "Chat with ..."
//     },
//     moderators: ["1263654651635"]
// }

// console.log(await startMessage.awaitReactions(reaction => reaction.emoji.name == "✅", { time: 3000 }));