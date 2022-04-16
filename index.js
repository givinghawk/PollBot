const config = require('./config.json');
const Discord = require('discord.js');
const canvas = require('canvas');
const fs = require('fs');
const http = require('http');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.on('ready', () => {
    if (client.guilds.cache.size === 1) {
        client.guilds.cache.plural = 'server';
    } else {
        client.guilds.cache.plural = 'servers';
    }
    client.user.setActivity(config.prefix + 'help on ' + client.guilds.cache.size + ' ' + client.guilds.cache.plural, { type: 'WATCHING' });
    console.log(`Logged in as ${client.user.tag} on ${client.guilds.cache.size} ${client.guilds.cache.plural}!`);
});

setInterval(() => {
    if (client.guilds.cache.size === 1) {
        client.guilds.cache.plural = 'server';
    } else {
        client.guilds.cache.plural = 'servers';
    }
    client.user.setActivity(config.prefix + 'help on ' + client.guilds.cache.size + ' ' + client.guilds.cache.plural, { type: 'WATCHING' });
    console.log("Updated client.guilds.cache.plural and status!")
}, 300000);

client.on('message', async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;
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
                var emojis = config.defaultemojis;
            }
            msg.react(emojis[i]);
        }
    }
    }
    if(message.content.startsWith(config.prefix + 'setpreset')) {
        let args = message.content.split(' ');
        args.shift();
        if(fs.existsSync(`./presets/${args[0]}.pollbotpreset`)) {
            fs.readFile('./presets/' + args[0] + '.pollbotpreset', 'utf8' , (err, data) => {
                if (err) {
                  console.error(err)
                  return
                }
                fs.writeFileSync('./settings/' + message.guild.id + '.json', data);
              })              
            message.reply("Set your preset to preset **" + args[0] + "**.");
        } else {
            message.reply("Hmm, I could not find that preset. Please make sure that your preset exists. You can see a list of avalable presets by going to http://" + config.webip + ":" + config.webport);
        }
    }
    if(message.content.startsWith(config.prefix + 'viewpreset')) {
        let args = message.content.split(' ');
        args.shift();
        if(fs.existsSync(`./presets/${args[0]}.pollbotpreset`)) {
            fs.readFile('./presets/' + args[0] + '.pollbotpreset', 'utf8' , (err, data) => {
                if (err) {
                  console.error(err)
                  return
                }
                // make the data variable json
                var json = JSON.parse(data);
                // make json variable a string but not as json
                var string = JSON.stringify(json);
                // remove json formatting from string
                var string = string.replace(/\\n/g, '\n');
                message.reply("Preset **" + args[0] + "**:\n" + json.emojis.join(" "));
              })              
        } else {
            message.reply("Hmm, I could not find that preset. Please make sure that your preset exists. You can see a list of avalable presets by going to http://" + config.webip + ":" + config.webport);
        }
    }
});

http.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("<style>body{background-color: #000;color: #fff;font-family: arial;font-size: 20px;}</style>");
        fs.readdir('./presets', (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                fs.readFile('./presets/' + file, 'utf8', (err, data) => {
                    if (err) throw err;
                    var json = JSON.parse(data);
                    var string = file.replace('.pollbotpreset', '');
                    res.write("Preset <strong>" + string + "</strong>: <img src=\"" + json.image + "\"><br>");
                });
            });
        });
    } else {
        res.writeHead(403);
        res.write("<style>body{background-color: #000;color: #fff;font-family: arial;font-size: 20px;}</style>");
        res.end('<h1>403 Forbidden</h1>');
    }
}).listen(config.webport);

client.login(config.token);