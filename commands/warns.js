const { SlashCommandBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');
const fs = require('fs');

module.exports = {
data: new SlashCommandBuilder()
.setName('warns')
.setDescription('Check how many warns a user has')
.addUserOption(option =>
option.setName('user')
.setDescription('User to check')
.setRequired(true)
),

async execute(interaction) {

if(!checkPerms(interaction.member, "warn")){
return interaction.reply({
content: "You don't have permission to use this command.",
ephemeral: true
});
}

const user = interaction.options.getUser('user');

let db = JSON.parse(fs.readFileSync('./database.json'));

if(!db.warns) db.warns = {};

const warns = db.warns[user.id] || 0;

interaction.reply(`${user.tag} has **${warns} warns**.`);

}

};