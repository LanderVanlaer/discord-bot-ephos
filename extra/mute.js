const { roles: { muteRole: roleName } } = require("../jsonData/botconfig.json");
const { defaultColor } = require("../jsonData/colors.json");


module.exports = member => {
    return new Promise(async (res, rej) => {
        let muterole = member.guild.roles.cache.find(x => x.name == roleName);
        if (!muterole) {
            try {
                await member.guild.roles.create({
                    data: {
                        name: roleName,
                        color: defaultColor
                    }
                });
                muterole = member.guild.roles.cache.find(x => x.name == roleName);
                member.guild.channels.cache.forEach(async channel => {
                    await channel.overwritePermissions([{
                        id: muterole.id,
                        deny: [
                            "SEND_MESSAGES",
                            "ADD_REACTIONS",
                            "STREAM",
                            "SPEAK"
                        ]
                    }]);
                });
            } catch (e) { rej(e) }
        }
        await member.roles.add(muterole);
        res(muterole);
    })
}