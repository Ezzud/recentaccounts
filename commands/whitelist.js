'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const config = require('../config.json')
const moment = require('moment')
moment.locale('fr')


module.exports.run = async (client, message, args) => {
	if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return;
	if(!args[0]) return(message.channel.send(`:x: Veuillez choisir entre \`add\` et \`remove\` `));
	if(args[0] === "add") {
		if(!args[1]) return(message.channel.send(`:x: Veuillez mentionner un utilisateur ou renseigner un identifiant`));
		var member;
        if (message.mentions.users.first()) {
            member = message.mentions.users.first().id
        }
        if (!member) member = args[1]
        if(member.length !== 18) {
        	return(message.channel.send(`:x: Celà ne ressemble pas à un identifiant ou une mention correcte`));
        }
        String.prototype.isNumber = function(){return /^\d+$/.test(this);}
        if(member.isNumber() === false) {
        	return(message.channel.send(`:x: Celà ne ressemble pas à un identifiant ou une mention correcte`));
        }
    	let database = new db.table("sanctions")
    	if(!await database.get(`${message.guild.id}.whitelist`)) {
    		await database.set(`${message.guild.id}.whitelist`, [{ id: "811928429678690365"}])
    	}
    	if(await database.get(`${message.guild.id}.whitelist`).find(x => x.id === member)) {
    		return(message.channel.send(`:x: Cet utilisateur figure déjà dans la liste blanche!`))
    	}
    	await database.push(`${message.guild.id}.whitelist`, { id: member })
    	await message.channel.send(`:white_check_mark: L'identifiant \`${member}\` a bien été ajouté dans la liste blanche, il ne sera pas affecté par la vérification du bot`)
	} else if(args[0] === "remove") {
		if(!args[1]) return(message.channel.send(`:x: Veuillez mentionner un utilisateur ou renseigner un identifiant`));
		var member;
        if (message.mentions.users.first()) {
            member = message.mentions.users.first().id
        }
        if (!member) member = args[1]
        if(member.length !== 18) {
        	return(message.channel.send(`:x: Celà ne ressemble pas à un identifiant ou une mention correcte`));
        }
        String.prototype.isNumber = function(){return /^\d+$/.test(this);}
        if(member.isNumber() === false) {
        	return(message.channel.send(`:x: Celà ne ressemble pas à un identifiant ou une mention correcte`));
        }
    	let database = new db.table("sanctions")
    	if(!await database.get(`${message.guild.id}.whitelist`)) {
    		await database.set(`${message.guild.id}.whitelist`, [{ id: "811928429678690365"}])
    	}
    	if(!await database.get(`${message.guild.id}.whitelist`).find(x => x.id === member)) {
    		return(message.channel.send(`:x: Cet utilisateur ne figure déjà pas dans la liste blanche!`))
    	}
    	let base = await database.get(`${message.guild.id}.whitelist`).filter(x => x.id !== member)
    	await database.set(`${message.guild.id}.whitelist`, [base])
    	console.log(await database.get(`${message.guild.id}.whitelist`))
    	await message.channel.send(`:white_check_mark: L'identifiant \`${member}\` a bien été retiré de la liste blanche, il sera désormais vérifié lorsque il rejoindra`)	
	} else {
		return(message.channel.send(`:x: Veuillez choisir entre \`add\` et \`remove\` `));
	}
}
module.exports.help = {
    name: "whitelist"
}