const { DARK_BLUE } = require("../jsonData/colors.json");
const { website } = require("../jsonData/botconfig.json");
const fs = require("fs");
module.exports = member => {
    // var role = member.guild.roles.find('name', BOT_CONFIG.roles.basic);
    // member.addRole(role);
    fs.readFile("jsonData/welcomeMessage.txt", (err, data) => {
        if (err) return console.log(err);
        member.send({
            embed: {
                content: '\u200B',
                color: DARK_BLUE,
                thumbnail: {
                    url: member.guild.iconURL
                },
                title: member.guild.name,
                description: `[Click here to check our site!](${website})`,
                fields: [{
                    name: 'About',
                    inline: false,
                    value: `
                        Welcome on the **${member.guild.name}** server
                        There are now ${member.guild.members.cache.filter(member => !member.user.bot).size} players in total on the server.
                        Talk, chat and game!
                    `
                }, {
                    name: '\u200B',
                    inline: false,
                    value: data
                }],
                footer: {
                    text: 'Type !verify in welcome to unlock the server.'
                },
                image: {
                    url: "https://drive.google.com/uc?export=view&id=12m28D15qPw9A2vFTcT3cFd0gIUaLrjVh"
                }
            }
        }).catch(err => {
            console.log(err)
        });
    })
}