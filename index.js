const config = require('./config.json');
const Discord = require('discord.js');
const canvas = require('canvas');
const fs = require('fs');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.on('ready', () => {
    client.user.setActivity(config.prefix + 'help on ' + client.guilds.size + ' servers', { type: 'WATCHING' });
    console.log(`Logged in as ${client.user.tag} on ${client.guilds.size} servers!`);
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.startsWith(config.prefix + 'help')) {
        message.reply("```\n" + config.prefix + "help - shows this message\n" + config.prefix + "setpreset [preset] - Set your preset\n" + config.prefix + "viewpreset [preset] - Show a preset\n" + config.prefix + "startpoll,[up to 8 options (comma seperated)] - Create a poll in the current channel```");
    }
    if(message.content.startsWith(config.prefix + 'startpoll')) {
        let args = message.content.split(',');
        if(args.length > 9) {
            message.reply("Too many options! There are only 8 emojis!");
        } else {
        args.shift();
        let Canvas = canvas.Canvas;
        let ctx = new Canvas(500, 125).getContext('2d');
        ctx.font = 'bold 20px arial';
        ctx.fillStyle = 'green';
        ctx.fillText(`New poll by ${message.author.username}`, 10, 50);
        ctx.fillText(args, 10, 100);
        let buffer = ctx.canvas.toBuffer();
        message.channel.send({ files: [{ attachment: buffer, name: 'poll.png' }] });
        await new Promise(r => setTimeout(r, 50));
        const msg = await message.channel.send(`**${message.author.username}** started a poll: \n${args.join('\n')}`);
        for(let i = 0; i < args.length; i++) {
            if(fs.existsSync(`./settings/${message.guild.id}.json`)) {
                var emojis = JSON.parse(fs.readFileSync('./settings/' + message.guild.id + '.json'));
                    const serverconfigemojis = require(`./settings/${message.guild.id}.json`);
                    var emojis = emojis.emojis;
            } else {
                var emojis = config.emojis;
            }
            msg.react(emojis[i]);
        }
    }
    }
    if(message.content.startsWith(config.prefix + 'setpreset')) {
        let args = message.content.split(' ');
        args.shift();
        if(args[0] == "1") {
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"]
            }));
            message.reply("Set your preset to preset **1**.");
        }
        if(args[0] == "2") {
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["⚫", "🟤", "🟣", "🔵", "🟢", "🟡", "🟠", "🔴"]
            }));
            message.reply("Set your preset to preset **2**.");
        }
        if(args[0] == "3") {
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭"]
            }));
            message.reply("Set your preset to preset **3**.");
        }
        if(args[0] == "4") {
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛"]
            }));
            message.reply("Set your preset to preset **4**.");
        }
        if(args[0] == "5") {
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["❤", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤"]
            }));
            message.reply("Set your preset to preset **5**.");
        }
        if(args[0] == "6") {
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆"]
            }));
            message.reply("Set your preset to preset **5**.");
        }
    }
    if(message.content.startsWith(config.prefix + 'viewpreset')) {
        let args = message.content.split(' ');
        args.shift();
        if(args[0] == "1") {
            message.reply("Preset **1** (default) 1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣, 6️⃣, 7️⃣, 8️⃣");
        }
        if(args[0] == "2") {
            message.reply("Preset **2** 🟤, 🟣, 🔵, 🟢, 🟡, 🟠, 🔴");
        }
        if(args[0] == "3") {
            message.reply("Preset **3** 🇦, 🇧, 🇨, 🇩, 🇪, 🇫, 🇬, 🇭");
        }
        if(args[0] == "4") {
            message.reply("Preset **4** 🟥, 🟧, 🟨, 🟩, 🟦, 🟪, 🟫, ⬛");
        }
        if(args[0] == "5") {
            message.reply("Preset **5** ❤, 🧡, 💛, 💚, 💙, 💜, 🤎, 🖤");
        }
        if(args[0] == "6") {
            message.reply("Preset **6** 😀, 😁, 😂, 🤣, 😃, 😄, 😅, 😆");
        }
    }
});

client.login(config.token);