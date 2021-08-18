'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const db = require('quick.db');
const config = require('../config.json')
const moment = require('moment')
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
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return;
    let database = new db.table("sanctions")
    if (!args[0]) {
        let minimum_time = await database.get(`${message.guild.id}.minimum_time`)
        if (!minimum_time) {
            minimum_time = 1296000000
            await database.set(`${message.guild.id}.minimum_time`, 1296000000)
        }
        let logschannel = await database.get(`${message.guild.id}.logschannel`)
        if (!logschannel) {
            logschannel = `Non Défini!`
        } else {
            logschannel = `<#${logschannel}>`
        }
        let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setThumbnail(message.guild.iconURL()).setColor("#12DDF1").setDescription(`Préfixe: **sec.**\nAge minimum du compte: **${await createDuration(minimum_time)}**\nSalon de logs: **${logschannel}**\n\n`).addField(`Changer une valeur?`, `sec.config logschannel \`#salon\` - Changer le salon de logs\nsec.config age \`age minimum du compte\` - Changer l'age minimum que le compte doit avoir pour rejoindre\n\nUnités pour l'age: **1m** (1 minutes), **1h** (1 heure), **6d** (6 jours)`).setFooter(`RecentAccounts TEST`)
        message.channel.send(embed)
    }
    if (args[0] === "logschannel") {
        var embed;
        let channel = message.mentions.channels.first()
        if (!channel) {
            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL()).setDescription(`:x: Veuillez renseigner un salon valide!`)
            return (message.channel.send(embed));
        } else {
            let check = message.guild.channels.cache.get(channel.id)
            if (!check) {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL()).setDescription(`:x: Le salon est introuvable ou n'est pas sur le serveur`)
                return (message.channel.send(embed));
            }
        }
        if (channel.type !== 'text') {
            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL()).setDescription(`:x: Le salon n'est pas un salon textuel!`)
            return (message.channel.send(embed));
        }
        if (channel.id === await database.get(`${message.guild.id}.logschannel`)) {
            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL()).setDescription(`:x: Ce salon est déjà le salon de logs!`)
            return (message.channel.send(embed));
        }
        await database.set(`${message.guild.id}.logschannel`, channel.id)
        message.channel.send(`:white_check_mark: Le salon de logs est désormais <#${await database.get(`${message.guild.id}.logschannel`)}>`)
    }
    if (args[0] === "age") {
        let duration = args[1]
        if (!duration) {
            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL()).setDescription(`:x: Veuillez renseigner une durée!`)
            return (message.channel.send(embed));
        }
        let timems = ms(duration)
        if (!timems) {
            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL()).setDescription(`:x: Veuillez renseigner une durée valide!`)
            return (message.channel.send(embed));
        } else {
            if (timems <= 300000) {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL()).setDescription(`:x: Veuillez renseigner une valeur supérieur à **5 minutes**, merci d'activer le niveau de modération \`Moyen\` si vous souhaitez bloquer les comptes plus récents!`)
                return (message.channel.send(embed));
            }
            if (timems > 157680000000) {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL()).setDescription(`:x: Veuillez renseigner une valeur inférieure à **5 ans**!`)
                return (message.channel.send(embed));
            }
            await database.set(`${message.guild.id}.minimum_time`, timems)
            message.channel.send(`:white_check_mark: L'age minimum d'un compte pour rejoindre le serveur est désormais **${await createDuration(await database.get(`${message.guild.id}.minimum_time`))}**`)
        }
    }
}
module.exports.help = {
    name: "config"
}