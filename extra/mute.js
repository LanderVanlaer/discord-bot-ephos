const { roles: { muteRole: roleName } } = require("../jsonData/botconfig.json");
const { defaultColor } = require("../jsonData/colors.json");


module.exports = member => {
    return new Promise(async (res, rej) => {
        let muterole = member.guild.roles.cache.find(x => x.name == roleName);
        if (!muterole) {
            try {
                await member.guild.roles.create({
                    data: {
                        // position: await member.guild.roles.cache.size, //Missing permissions
                        name: roleName,
                        color: defaultColor
                    }
                });
                muterole = member.guild.roles.cache.find(x => x.name == roleName);
                member.guild.channels.cache.forEach(async channel => {
                    await channel.updateOverwrite(muterole.id, {
                        "SEND_MESSAGES": false,
                        "ADD_REACTIONS": false,
                        "STREAM": false,
                        "SPEAK": false
                    });
                });
            } catch (e) { rej(e) }
        }
        await member.roles.add(muterole);
        res(muterole);
    })
}