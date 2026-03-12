const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');
const fs = require('fs');
console.log("WARN COMMAND LOADED");

module.exports = {
data: new SlashCommandBuilder()
.setName('warn')
.setDescription('Warn a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User to warn')
.setRequired(true)
)
.addStringOption(option =>
option.setName('reason')
.setDescription('Reason for the warning')
.setRequired(false)
),

async execute(interaction) {

if(!checkPerms(interaction.member, "warn")){
return interaction.reply({
content: "You don't have permission to use this command.",
ephemeral: true
});
}

const user = interaction.options.getUser('user');
const reason = interaction.options.getString('reason') || "Rule violation";

let db = JSON.parse(fs.readFileSync('./database.json','utf8'));

if(!db.warns) db.warns = {};
if(!db.warns[user.id]) db.warns[user.id] = 0;

db.warns[user.id]++;

fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));

const embed = new EmbedBuilder()
.setColor("#ffcc00")
.setTitle("<:StaffBadgeRed:1481520734382719111> Klien Warning Moderation Action")
.setDescription("User warned")
.addFields(
{ name: "・Username:", value: `<@${user.id}>`, inline: false },
{ name: "・Channel:", value: `<#${interaction.channel.id}>`, inline: false },
{ name: "・Reason:", value: reason, inline: false },
{ name: "・Issued By:", value: `<@${interaction.user.id}>`, inline: false }
)
.setFooter({ text: "If you wish to appeal this warning, Please open a ticket in support" })
.setTimestamp();

await interaction.reply({
content: `<@${user.id}>`,
embeds: [embed]
});

}
};