const { SlashCommandBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');
const fs = require('fs');

module.exports = {
data: new SlashCommandBuilder()
.setName('removewarn')
.setDescription('Remove a warn from a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User to remove warn from')
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

if(!db.warns[user.id]) db.warns[user.id] = 0;

if(db.warns[user.id] === 0){
return interaction.reply(`${user.tag} has no warns to remove.`);
}

db.warns[user.id]--;

fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));

interaction.reply(`Removed **1 warn** from ${user.tag}. Remaining warns: ${db.warns[user.id]}`);

}

};