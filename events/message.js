'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const settings = require('../config.json');
const db = require('quick.db');
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    const prefix = settings.prefix
    if (message.content.startsWith(prefix)) {
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();
        let commande_file = client.commands.get(command);
        if (commande_file) commande_file.run(client, message, args);
    }
}
