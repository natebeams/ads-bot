const { SlashCommandBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');
const fs = require('fs');

module.exports = {
data: new SlashCommandBuilder()
.setName('adwarns')
.setDescription('Check ad warns for a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User to check')
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

const warns = db.adwarns[user.id] || 0;

interaction.reply(`${user.tag} has **${warns} Ad Warns**.`);

}

};