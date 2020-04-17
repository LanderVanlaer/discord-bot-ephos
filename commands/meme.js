const { MessageEmbed } = require("discord.js");
const { DARK_GREEN } = require("../jsonData/colors.json");
const fetch = require('node-fetch');
const possibilities = ["dank", "moderate", "light", "furry", "sbubby"];

module.exports.run = async (bot, message, args) => {
    let indexMeme;
    if (args[0] && possibilities.includes(args[0].toLowerCase()))
        indexMeme = possibilities.indexOf(args[0].toLowerCase());
    else
        indexMeme = Math.floor(Math.random() * possibilities.length);

    const
        request = await fetch(`https://meme-api.glitch.me/${possibilities[indexMeme]}`),
        json = await request.json();


    message.channel.send(
        new MessageEmbed()
        .setTitle(`${possibilities[indexMeme]} Meme`)
        .setAuthor("Link To Image", bot.user.displayAvatarURL(), json.meme)
        .setColor(DARK_GREEN)
        .setImage(json.meme)
    );
}

module.exports.help = {
    name: "meme",
    description: `give a meme possibilities: ${possibilities}`,
    administrator: false,
    usage: "meme <your kind of meme>"
}