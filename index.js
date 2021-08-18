const Discord = require("discord.js");
const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER']
});
const ms = require('ms');
const settings = require('./config.json');
const fs = require('fs');
const EditJsonFile = require('edit-json-file');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const moment = require('moment');
const json = require('./package.json')
var util = require('util');
const log_stdout = process.stdout;
const storage = require("quick.db");
moment.locale("fr")
 
let date = new Date();
date.setHours(date.getHours() + 2);
let path = `./logs/${moment(date).format('MM-D-YYYY')}.log`;
let logs;
let logstr;
try {
    if (fs.existsSync(path)) {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY')}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY')}.log`;
    } else {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY')}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY')}.log`;
    }
} catch (err) {
    console.error(err);
}
const logs_path = logstr;
client.logs_path = logs_path;
setInterval(async () => {
    let date = new Date();
date.setHours(date.getHours() + 2);
let path = `./logs/${moment(date).format('MM-D-YYYY')}.log`;
let logs;
let logstr;
try {
    if (fs.existsSync(path)) {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY')}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY')}.log`;
    } else {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY')}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY')}.log`;
    }
} catch (err) {
    console.error(err);
}
client.logs_path = logstr;
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${logstr}`, `\n${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`(${moment().format("LT")}) ` + util.format(d) + '\n');
};
}, 300000);
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${logs_path}`, `\n${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`(${moment().format("LT")}) ` + util.format(d) + '\n');
};
console.log(`Logs path set to: ${logstr}`)



// START
launch().then(console.log(`\x1b[0m[Statut]` + ` \x1b[32m ON` + `\x1b[0m`));
async function launch() {
    await _eventHandler();
    await _commandHandler();
}
/*/

    Configuration et fonctions

/*/
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

function _commandHandler() {
    fs.readdir("./commands/", (err, files) => {
        if (err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("Aucun fichier trouvé dans ./commands/");
            return;
        }
        jsfile.forEach((f, i) => {
            let props = require(`./commands/${f}`);
            console.log(`\x1b[36m[COMMANDES]` + ` \x1b[0mFichier ${f}` + `\x1b[0m`);
            client.commands.set(props.help.name, props);
        });
        console.log(`\x1b[32m` + ` \x1b[32mChargement des commandes effectué` + `\x1b[0m`);
    });
}

function _eventHandler() {
    fs.readdir('./events/', async (err, f) => {
        if (err) console.log(err);
        let jsfile = f.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("Aucun fichier trouvé dans ./events/");
            return;
        }
        f.forEach((f) => {
            const events = require(`./events/${f}`);
            console.log(`\x1b[35m[EVENTS]` + ` \x1b[0mFichier ${f}` + `\x1b[0m`);
            const event = f.split(".")[0];
            client.on(event, events.bind(null, client));
        });
        console.log(`\x1b[32m` + ` \x1b[32mChargement des events effectué` + `\x1b[0m`);
    });
}
client.login(settings.token);
/*/

        Partie READY

/*/
console.log(`\x1b[34m[API]` + `\x1b[37m Connexion...` + `\x1b[0m`);
client.time = new Date()