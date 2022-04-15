// import config
const config = require('./config.json');
// import discord.js
const Discord = require('discord.js');
// import canvas
const canvas = require('canvas');
// import fs
const fs = require('fs');

// login to discord with intents and load everyone
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

// ready event
client.on('ready', () => {
    // set the bots activity to pb.help
    client.user.setActivity('pb.help', { type: 'WATCHING' });
    console.log(`Logged in as ${client.user.tag}!`);
});

// message event async
client.on('message', async message => {
    // ignore messages from bots
    if(message.author.bot) return;
    // if message is config.prefix + help, send a message
    if(message.content.startsWith(config.prefix + 'help')) {
        message.reply("Help yourself, I can't help you.");
    }
    // if message starts with config.prefix + startpoll, split the message into an array
    if(message.content.startsWith(config.prefix + 'startpoll')) {
        // split the message into an array
        let args = message.content.split(' ');
        // count args, and if there are more than 10 args, send a message
        if(args.length > 9) {
            message.reply("Too many options! There are only 8 emojis!");
        } else {
        // remove the first element of the array (the command)
        args.shift();
        // for every option, add an emoji and a new line to the message
        // create an image with canvas
        let Canvas = canvas.Canvas;
        let ctx = new Canvas(500, 125).getContext('2d');
        // set the font to arial, bold, and size 20
        ctx.font = 'bold 20px arial';
        // set the text color to green
        ctx.fillStyle = 'green';
        // set the text to be "New poll by " + the author's name
        ctx.fillText(`New poll by ${message.author.username}`, 10, 50);
        // set the text to the args variable
        ctx.fillText(args, 10, 100);
        // create a buffer from the canvas
        let buffer = ctx.canvas.toBuffer();
        // send the buffer as a file
        message.channel.send({ files: [{ attachment: buffer, name: 'poll.png' }] });
        // wait for 50 miliseconds
        await new Promise(r => setTimeout(r, 50));
        // create a new poll
        const msg = await message.channel.send(`**${message.author.username}** started a poll: \n${args.join('\n')}`);
        // for every argument, add a reaction of a different number emoji
        for(let i = 0; i < args.length; i++) {
            // if the file './settings/' + message.guild.id + '.json' exists, set emojis to the emojis in the file
            if(fs.existsSync(`./settings/${message.guild.id}.json`)) {
                var emojis = JSON.parse(fs.readFileSync('./settings/' + message.guild.id + '.json'));
                    const serverconfigemojis = require(`./settings/${message.guild.id}.json`);
                    // if the emojis array is not empty, set emojis to the emojis in the file
                    var emojis = emojis.emojis;
            } else {
                var emojis = config.emojis;
            }
            // react with the emoji
            msg.react(emojis[i]);
        }
    }
    }
    // if the message is config.prefix + setpreset, split the message into an array and write to a file
    if(message.content.startsWith(config.prefix + 'setpreset')) {
        // split the message into an array
        let args = message.content.split(' ');
        // remove the first element of the array (the command)
        args.shift();
        // write the new preset to the config file
        // if the args are "1"
        if(args[0] == "1") {
            // write the args to the config file
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"]
            }));
            message.reply("Set your preset to preset **1**.");
        }
        if(args[0] == "2") {
            // write the args to the config file
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["⚫", "🟤", "🟣", "🔵", "🟢", "🟡", "🟠", "🔴"]
            }));
            message.reply("Set your preset to preset **2**.");
        }
        if(args[0] == "3") {
            // write the args to the config file
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭"]
            }));
            message.reply("Set your preset to preset **3**.");
        }
        if(args[0] == "4") {
            // write the args to the config file
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛"]
            }));
            message.reply("Set your preset to preset **4**.");
        }
        if(args[0] == "5") {
            // write the args to the config file
            fs.writeFileSync('./settings/' + message.guild.id + '.json', JSON.stringify({
                emojis: ["❤", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤"]
            }));
            message.reply("Set your preset to preset **5**.");
        }
    }
    // if message starts with config.prefix + viewpreset, send a message
    if(message.content.startsWith(config.prefix + 'viewpreset')) {
        // split the message into an array
        let args = message.content.split(' ');
        // remove the first element of the array (the command)
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
    }
});

client.login(config.token);