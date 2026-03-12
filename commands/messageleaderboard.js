const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
data: new SlashCommandBuilder()
.setName('messageleaderboard')
.setDescription('Shows the top message senders'),

async execute(interaction) {

let db = JSON.parse(fs.readFileSync('./database.json'));

if(!db.messages) db.messages = {};

let sorted = Object.entries(db.messages)
.sort((a,b)=>b[1]-a[1])
.slice(0,10);

if(sorted.length === 0){
return interaction.reply("No messages have been recorded yet.");
}

let text = sorted
.map((u,i)=>`${i+1}. <@${u[0]}> — ${u[1]} messages`)
.join("\n");

interaction.reply(`📊 **Message Leaderboard**\n${text}`);

}

};