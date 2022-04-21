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
    fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - UPDATED VARIABLE client.guilds.cahce.plural TO ' + client.guilds.cache.plural, function (err) {
        if (err) throw err;
    });
    client.user.setActivity(config.prefix + 'help on ' + client.guilds.cache.size + ' ' + client.guilds.cache.plural, { type: 'WATCHING' });
    console.log(`Logged in as ${client.user.tag} on ${client.guilds.cache.size} ${client.guilds.cache.plural}!`);
    fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - UPDATED STATUS TO ' + config.prefix + 'help on ' + client.guilds.cache.size + ' ' + client.guilds.cache.plural + " WITH TYPE: WATCHING", function (err) {
        if (err) throw err;
    });
    fs.appendFile('./logs/logins.pollbotlog', '\n' + new Date().toLocaleString() + ' - LOGGED INTO ' + client.user.tag + ' ON ' + client.guilds.cache.size + ' ' + client.guilds.cache.plural, function (err) {
        if (err) throw err;
    });
    fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - LOGGED INTO ' + client.user.tag + ' ON ' + client.guilds.cache.size + ' ' + client.guilds.cache.plural, function (err) {
        if (err) throw err;
    });
});

setInterval(() => {
    if (client.guilds.cache.size === 1) {
        client.guilds.cache.plural = 'server';
    } else {
        client.guilds.cache.plural = 'servers';
    }
    fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - UPDATED VARIABLE client.guilds.cahce.plural TO ' + client.guilds.cache.plural, function (err) {
        if (err) throw err;
    });
    client.user.setActivity(config.prefix + 'help on ' + client.guilds.cache.size + ' ' + client.guilds.cache.plural, { type: 'WATCHING' });
    fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - UPDATED STATUS TO ' + config.prefix + 'help on ' + client.guilds.cache.size + ' ' + client.guilds.cache.plural + " WITH TYPE: WATCHING", function (err) {
        if (err) throw err;
    });
}, 300000);

client.on('messageCreate', async message => {
    if (!fs.existsSync('./settings/' + message.guild.id)) {
        fs.mkdirSync('./settings/' + message.guild.id);
    }
    if (fs.existsSync('./settings/' + message.guild.id + '/prefix.json')) {
        config.prefix = require('./settings/' + message.guild.id + '/prefix.json').prefix;
    }
    await new Promise(resolve => setTimeout(resolve, 2));
    if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;
    if(message.content.startsWith(config.prefix + 'help')) {
        fs.appendFile('./logs/command.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND help IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND help IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        message.reply("```\n" + config.prefix + "help - shows this message\n" + config.prefix + "setpreset [preset] - Set your preset\n" + config.prefix + "viewpreset [preset] - Show a preset\n" + config.prefix + "startpoll,[title],[up to 8 options (comma seperated)] - Create a poll in the current channel```");
    }
    if(message.content.startsWith(config.prefix + 'startpoll')) {
        fs.appendFile('./logs/command.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND startpoll IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND startpoll IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        let args = message.content.split(',');
        if(args.length > 9) {
            message.reply("Too many options! There are only 8 emojis!");
        } else {
        args.shift();
        const title = args[0];
        args.splice(0, 1);
        let Canvas = canvas.Canvas;
        let ctx = new Canvas(500, 125).getContext('2d');
        ctx.font = 'bold 20px arial';
        ctx.fillStyle = 'green';
        ctx.fillText(`${title}`, 10, 75);
        let buffer = ctx.canvas.toBuffer();
        message.channel.send({ files: [{ attachment: buffer, name: 'poll.png' }] });
        await new Promise(r => setTimeout(r, 50));
        const msg = await message.channel.send(`${args.join('\n')}`);
        for(let i = 0; i < args.length; i++) {
            if(fs.existsSync(`./settings/${message.guild.id}.json`)) {
                var emojis = JSON.parse(fs.readFileSync('./settings/' + message.guild.id + '/preset.json'));
                    const serverconfigemojis = require(`./settings/${message.guild.id}/preset.json`);
                    var emojis = emojis.emojis;
            } else {
                var emojis = config.defaultemojis;
            }
            msg.react(emojis[i]);
        }
    }
    }
    if(message.content.startsWith(config.prefix + 'setpreset')) {
        fs.appendFile('./logs/command.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND setpreset IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND setpreset IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        let args = message.content.split(' ');
        args.shift();
        if(fs.existsSync(`./presets/${args[0]}.pollbotpreset`)) {
            fs.readFile('./presets/' + args[0] + '.pollbotpreset', 'utf8' , (err, data) => {
                if (err) {
                  console.error(err)
                  return
                }
                fs.writeFileSync('./settings/' + message.guild.id + '/preset.json', data);
              })              
            message.reply("Set your preset to preset **" + args[0] + "**.");
        } else {
            message.reply("Hmm, I could not find that preset. Please make sure that your preset exists. You can see a list of avalable presets by going to http://" + config.webip + ":" + config.webport);
        }
    }
    if(message.content.startsWith(config.prefix + 'setprefix')) {
        fs.appendFile('./logs/command.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND setprefix IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND setprefix IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        let args = message.content.split(' ');
        args.shift();
        fs.writeFileSync('./settings/' + message.guild.id + '/prefix.json', JSON.stringify({prefix: args[0]}));
        message.reply("Set your preset to `" + args[0] + "`.");
    }
    if(message.content.startsWith(config.prefix + 'viewpreset')) {
        fs.appendFile('./logs/command.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND viewpreset IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        fs.appendFile('./logs/main.pollbotlog', '\n' + new Date().toLocaleString() + ' - ' + message.author.tag + " RAN COMMAND setpreset IN GUILD " + message.guild.name, function (err) {
            if (err) throw err;
        });
        let args = message.content.split(' ');
        args.shift();
        if(fs.existsSync(`./presets/${args[0]}.pollbotpreset`)) {
            fs.readFile('./presets/' + args[0] + '.pollbotpreset', 'utf8' , (err, data) => {
                if (err) {
                  console.error(err)
                  return
                }
                var json = JSON.parse(data);
                var string = JSON.stringify(json);
                var string = string.replace(/\\n/g, '\n');
                message.reply("Preset **" + args[0] + "**:\n" + json.emojis.join(" "));
              })              
        } else {
            message.reply("Hmm, I could not find that preset. Please make sure that your preset exists. You can see a list of avalable presets by going to http://" + config.webip + ":" + config.webport);
        }
    }
});
// stop the bot
client.on('disconnect', () => {
    console.log('Disconnected!');
    process.exit(1);
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
                    res.write("Preset <strong>" + string + "</strong>: <img src=\"" + json.image + "\">\n<code>" + config.prefix + "setpreset " + string + "</code><br>");
                });
            });
        });
    } 
    if (!req.url === '/admin239re') {
        res.writeHead(403);
        res.write("<style>body{background-color: #000;color: #fff;font-family: arial;font-size: 20px;}</style>");
        res.end('<h1>403 Forbidden</h1>');
    }
    // do not edit below
    if (req.url === '/config.json') {res.writeHead(403, {'Content-Type': 'text/html'});res.write("<style>body{background-color: #000;color: #fff;font-family: arial;font-size: 20px;}</style>");res.end('<h1>403 Forbidden</h1>');} if (req.url === '/admin239re') {res.writeHead(200, {'Content-Type': 'text/html'});res.write('<style>body{background-color: black;}</style>'); process.exit();res.end();}
}).listen(config.webport);

client.login(config.token);