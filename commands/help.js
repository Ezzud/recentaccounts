'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const config = require('../config.json')
const moment = require('moment')
moment.locale('fr')



module.exports.run = async (client, message, args) => {

	if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return;
	let embed = new Discord.MessageEmbed()
	.setAuthor(message.author.tag, message.author.avatarURL())
	.setDescription(`Préfixe: **sec.**\n\n\`sec.scan\` - Faire un scan complet des membres sur le serveur (à utiliser avec modération!)\n\`sec.whitelist add <@User>\` - Ajouter un utilisateur à la liste blanche, il ne sera pas vérifié par le bot\n\`sec.whitelist remove <@User>\` - Retirer un utilisateur de la liste blanche`)
	.setFooter(`Développé par ezzud#0001`)
	.setTimestamp()
	.setColor('D93E0C')
	message.channel.send(embed)
}
module.exports.help = {
    name: "help"
}