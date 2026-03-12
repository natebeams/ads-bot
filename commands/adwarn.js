const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');
const fs = require('fs');

module.exports = {
data: new SlashCommandBuilder()
.setName('adwarn')
.setDescription('Warn a user for advertising')
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

if(!checkPerms(interaction.member, "adwarn")){
return interaction.reply({
content: "You don't have permission to use this command.",
ephemeral: true
});
}

const user = interaction.options.getUser('user');
const reason = interaction.options.getString('reason') || "Advertising";

let db = JSON.parse(fs.readFileSync('./database.json','utf8'));

if(!db.adwarns) db.adwarns = {};
if(!db.adwarns[user.id]) db.adwarns[user.id] = 0;

db.adwarns[user.id]++;

fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));

const embed = new EmbedBuilder()
.setColor("#ff2e2e")
.setTitle("<:StaffBadgeRed:1481520734382719111> Klien Advertising Moderation Action")
.setDescription("Advertisement deleted")
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