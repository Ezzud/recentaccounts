'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const config = require('../config.json')
const moment = require('moment')
const hastebin = require('hastebin')
moment.locale('fr')

async function createDuration(millis) {
    var lang = {
        "infoDays": "jours",
        "infoHours": "heures",
        "infoMinutes": "minutes",
        "infoSeconds": "secondes"
    }
    let roundTowardsZero = millis > 0 ? Math.floor : Math.ceil;
    let days = roundTowardsZero(millis / 86400000),
        hours = roundTowardsZero(millis / 3600000) % 24,
        minutes = roundTowardsZero(millis / 60000) % 60,
        seconds = roundTowardsZero(millis / 1000) % 60;
    let dayUnit = days < 2 && (lang.infoDays.endsWith('s')) ? lang.infoDays.substr(0, lang.infoDays.length - 1) : lang.infoDays,
        hourUnit = hours < 2 && (lang.infoHours.endsWith('s')) ? lang.infoHours.substr(0, lang.infoHours.length - 1) : lang.infoHours,
        minuteUnit = minutes < 2 && (lang.infoMinutes.endsWith('s')) ? lang.infoMinutes.substr(0, lang.infoMinutes.length - 1) : lang.infoMinutes,
        secondUnit = seconds < 2 && (lang.infoSeconds.endsWith('s')) ? lang.infoSeconds.substr(0, lang.infoSeconds.length - 1) : lang.infoSeconds;
    var msg = "";
    if (days > 0) msg = `${msg}${days} ${dayUnit} `;
    if (hours > 0) msg = `${msg}${hours} ${hourUnit} `;
    if (minutes > 0) msg = `${msg}${minutes} ${minuteUnit} `;
    if (seconds > 0) msg = `${msg}${seconds} ${secondUnit}`;
    return(msg);
}



module.exports.run = async (client, message, args) => {
    if (!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return;
    var members = await message.guild.members.fetch()
    let emoji = client.emojis.cache.get("732607540919271424")
    await message.channel.send(`${emoji} Vérification de **${members.size}** utilisateurs`)
    var time = new Date()
    let database = new db.table("sanctions")
    await database.set(`${message.guild.id}.dlist`, 0)
    await database.set(`${message.guild.id}.alist`, 0)
    await database.set(`${message.guild.id}.plist`, 0)
    await database.set(`${message.guild.id}.surelist`, [])
    await database.set(`${message.guild.id}.nopplist`, [])
    members.forEach(async user => {
        let data = await database.get(`${message.guild.id}.whitelist`)
        if (!data) {
            await database.set(`${message.guild.id}.whitelist`, [{
                id: "811928429678690365"
            }])
            data = []
        }
        if (data.find(u => u.id === user.id)) return;
        let udate = user.user.createdTimestamp
        let reqdate = new Date().getTime()
    let minimum_time = await database.get(`${message.guild.id}.minimum_time`)
    if (!minimum_time) {
        minimum_time = 1296000000
        await database.set(`${message.guild.id}.minimum_time`, 1296000000)
    }
    if (reqdate - udate < minimum_time) {
            await database.add(`${message.guild.id}.dlist`, 1)
            await database.push(`${message.guild.id}.surelist`, {
                id: `${user.id}`,
                tag: `${user.user.tag}`,
                date: udate
            })
            message.channel.send(`:warning: \`${user.user.tag} (${user.id})\` a été créé **${moment(udate).fromNow()}** (${moment(udate).format('L')} ${moment(udate).format('LT')})`)
        }
        if (!user.user.avatarURL()) {
            await database.add(`${message.guild.id}.plist`, 1)
            await database.push(`${message.guild.id}.nopplist`, {
                id: `${user.id}`,
                tag: `${user.user.tag}`,
                date: udate
            })
        }
    })
    let delay = new Date() - time;
    delay = delay / 10
    let clean = members.size - await database.get(`${message.guild.id}.dlist`)
    let surelist = await database.get(`${message.guild.id}.surelist`)
    surelist = surelist.map(x => `Tag: ${x.tag} ID: ${x.id} Date: ${moment(x.date).fromNow()} (${moment(x.date).format('lll')})\n`)
    let nopplist = await database.get(`${message.guild.id}.nopplist`)
    nopplist = nopplist.map(x => `Tag: ${x.tag} ID: ${x.id} Date: ${moment(x.date).fromNow()} (${moment(x.date).format('lll')})\n`)
    await hastebin.createPaste(`Comptes (-${await createDuration(await database.get(`${message.guild.id}.minimum_time`))}): \n\n${surelist}\n------------------------------------\nComptes sans photo de profil:\n\n${nopplist}\n------------------------------------`, {
        raw: true,
        contentType: 'text/plain',
        server: 'http://185.157.247.184:7777'
    }, {}).then(async function(urlToPaste) {
        let url = urlToPaste.replace("raw/", "")
        await database.set(`${message.guild.id}.url`, url)
    })
    let embed = new Discord.MessageEmbed().setTitle(`:white_check_mark: Scan terminé!`).setThumbnail(client.user.avatarURL()).setDescription(`**${members.size}** utilisateurs scannés\n\u200B`).addField(`Résultats:`, `:green_circle:  **${clean}** utilisateurs normaux\n:red_circle:  **${await database.get(`${message.guild.id}.dlist`)}** utilisateurs plus jeunes que la valeur configurée (-${await createDuration(await database.get(`${message.guild.id}.minimum_time`))})\n:blue_circle: **${await database.get(`${message.guild.id}.plist`)}** comptes sans photo de profil\n\u200B`).addField(`Liste complète:`, `[Cliquer ici](${await database.get(`${message.guild.id}.url`)})\n\u200B`).setColor("17F0D2").setTimestamp().setFooter(`Effectué en ${delay}s`)
    message.channel.send(embed)
}
module.exports.help = {
    name: "scan"
}