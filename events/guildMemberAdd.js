'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const config = require('../config.json')
const moment = require('moment')
moment.locale('fr')
module.exports = async (client, member) => {
    if (member.user.bot) return;
    if (member.guild.id !== "643188015660924928" && member.guild.id !== "645727729353752592") return;
    let database = new db.table("sanctions")
    if (!await database.get(`${message.guild.id}.ID`)) {
        await database.set(`${message.guild.id}.ID`, 0)
    }
    if (!await database.get(`${message.guild.id}.whitelist`)) {
        await database.set(`${message.guild.id}.whitelist`, [{
            id: "811928429678690365"
        }])
    }
    let data = await database.get(`${message.guild.id}.whitelist`)

    if (data.find(u => u.id === member.id)) return;
    let udate = member.user.createdTimestamp
    let reqdate = new Date().getTime()
    let channel = await member.guild.channels.cache.get(await database.get(`${message.guild.id}.logschannel`))
    let minimum_time = await database.get(`${message.guild.id}.minimum_time`)
    if (!minimum_time) {
        minimum_time = 1296000000
        await database.set(`${message.guild.id}.minimum_time`, 1296000000)
    }
    if (reqdate - udate < minimum_time) {
        await database.add(`${message.guild.id}.ID`, 1)
        let embed = new Discord.MessageEmbed().setTitle("⚠ Compte Suspect détecté").setDescription("Raison: **Compte créé récemment**\n\u200B").addField(`🗒 Détails`, `Utilisateur: \`${member.user.tag} (${member.id}) \`\nCe compte a été créé **${moment(udate).fromNow()}** (${moment(udate).format('L')} ${moment(udate).format('LT')})\n\u200B`).addField(`📣 Action`, `Expulsion du serveur\n\u200B`).setThumbnail(member.user.avatarURL()).setColor('DE1919').setFooter(`ID: ${await database.get(`${message.guild.id}.ID`)}`).setTimestamp()
        console.log(`SUS | ${member.user.tag} (${member.id}) ${moment(udate).fromNow()}`)
        var sended = false;
        await member.send(`:x: **Vous avez été expulsé du serveur ${member.guild.name} car votre compte discord est trop récent!**`).catch(async error => {
            if (error.code === 50007) {
                sended = true;
                await member.kick(`Compte trop récent (Créé ${moment(reqdate - udate).fromNow()})`)
                if (channel) channel.send(embed);
            }
        })
        if (sended === true) return;
        await member.kick(`Compte trop récent (Créé ${moment(reqdate - udate).fromNow()})`)
        if (channel) channel.send(embed);
    } else {
        if (!member.user.avatarURL()) {
            await database.add(`ID`, 1)
            let embed = new Discord.MessageEmbed().setTitle("⚠ Compte Suspect détecté").setDescription(`Raison: **Compte sans photo de profil**\n\u200B`).addField(`🗒 Détails`, `Utilisateur: \`${member.user.tag} (${member.id}) \`\nCe compte a été créé **${moment(udate).fromNow()}** (${moment(udate).format('L')} ${moment(udate).format('LT')})\n\u200B`).addField(`📣 Action`, `Aucune\n\u200B`).setColor('F0C517').setThumbnail(member.user.avatarURL()).setFooter(`ID: ${await database.get("ID")}`).setTimestamp()
            if (channel) channel.send(embed);
            console.log(`PP | ${member.user.tag} (${member.id}) ${moment(udate).fromNow()}`)
        }
    }
}