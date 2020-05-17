module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`You're not allowed to use that command.`);

    if (args.length < 2) return message.reply(`Invalid time input`)
    const timeText = args.shift().split(':');
    const time = {
        hours: Number(timeText[0]),
        minutes: Number(timeText[1])
    }
    if (!time.hours || !time.minutes) return message.reply(`Invalid time input`)

    const dateNow = new Date();
    const newDate = new Date(Date.UTC(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dateNow.getUTCDate(), time.hours, time.minutes));
    const timeDifference = newDate - dateNow;
    if (timeDifference <= 0) return message.reply(`Invalid time input`)
    if (timeDifference > 129600000) return message.reply(`Time too long`) //1.5*24*60*60*1000
    message.delete().catch(console.error);

    setTimeout(() => {
        require('./say').run(bot, message, args, true);
    }, timeDifference)
}

module.exports.help = {
    name: "timer",
    description: "set a timer for the bot to say",
    administrator: true,
    usage: "timer <when (24h) (UTC)> <content>"
}
// !timer 16:30 {daarla:"azeaze"}