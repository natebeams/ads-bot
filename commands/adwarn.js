const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');
const fs = require('fs');

const MOD_LOG_CHANNEL = "1481114583543316511"; // replace with your log channel ID

module.exports = {
data: new SlashCommandBuilder()
.setName('adwarn')
.setDescription('Warn a user for advertising')
.addUserOption(option =>
option.setName('user')
.setDescription('User to warn for advertising')
.setRequired(true)
)
.addStringOption(option =>
option.setName('reason')
.setDescription('Reason for the ad warning')
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
const reason = interaction.options.getString('reason') || "Advertising violation";

let db = JSON.parse(fs.readFileSync('./database.json'));

if(!db.adwarns) db.adwarns = {};
if(!db.adwarns[user.id]) db.adwarns[user.id] = 0;

db.adwarns[user.id]++;

fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));

const embed = new EmbedBuilder()
.setColor("#1b2df0")
.setTitle("📢 Advertising Warning")
.setDescription(`${user.tag} has been **warned for advertising**.`)
.addFields(
{ name: "Reason", value: reason },
{ name: "Total Ad Warns", value: `${db.adwarns[user.id]}`, inline: true }
)
.setTimestamp();

await interaction.reply({ embeds: [embed] });

/* ---------- MOD LOG ---------- */

const logChannel = interaction.guild.channels.cache.get(MOD_LOG_CHANNEL);

if (logChannel) {

const logEmbed = new EmbedBuilder()
.setColor("#FF2E2E")
.setTitle("🚨 Moderation Action")
.addFields(
{ name: "User", value: `${user.tag} (${user.id})` },
{ name: "Moderator", value: `${interaction.user.tag}` },
{ name: "Action", value: "Ad Warn", inline: true },
{ name: "Reason", value: reason },
{ name: "Total Ad Warns", value: `${db.adwarns[user.id]}`, inline: true }
)
.setTimestamp();

logChannel.send({ embeds: [logEmbed] });

}

}
};