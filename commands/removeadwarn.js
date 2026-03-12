const { SlashCommandBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');
const fs = require('fs');

module.exports = {
data: new SlashCommandBuilder()
.setName('removeadwarn')
.setDescription('Remove an ad warn from a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User')
.setRequired(true)
),

async execute(interaction) {

if(!checkPerms(interaction.member, "adwarn")){
return interaction.reply({
content: "You don't have permission to use this command.",
ephemeral: true
});
}

const user = interaction.options.getUser('user');

let db = JSON.parse(fs.readFileSync('./database.json'));

if(!db.adwarns) db.adwarns = {};

if(!db.adwarns[user.id]) db.adwarns[user.id] = 0;

if(db.adwarns[user.id] === 0){
return interaction.reply(`${user.tag} has no Ad Warns to remove.`);
}

db.adwarns[user.id]--;

fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));

interaction.reply(`Removed **1 Ad Warn** from ${user.tag}. Remaining: ${db.adwarns[user.id]}`);

}

};