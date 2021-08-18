'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const settings = require('../config.json');
const db = require('quick.db');
module.exports = async (client, message) => {
	console.log(`\x1b[34m[API]` + ` \x1b[0mConnecté`)
	let userCount = client.guilds.cache.map((g) => g.memberCount).reduce((p, c) => p + c);
    setInterval(async () => {
        await client.user.setPresence({
            activity: {
                name: `${userCount} utilisateurs`
            },
            status: 'dnd'
        })
	}, 60000);
}