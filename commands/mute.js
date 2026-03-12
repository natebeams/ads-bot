const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');

const MOD_LOG_CHANNEL = "1481114583543316511";

module.exports = {
data: new SlashCommandBuilder()
.setName('mute')
.setDescription('Timeout (mute) a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User to mute')
.setRequired(true)
)
.addIntegerOption(option =>
option.setName('minutes')
.setDescription('How long to mute (minutes)')
.setRequired(true)
)
.addStringOption(option =>
option.setName('reason')
.setDescription('Reason for the mute')
.setRequired(false)
),

async execute(interaction) {

if(!checkPerms(interaction.member, "mute")){
return interaction.reply({
content: "You don't have permission to use this command.",
ephemeral: true
});
}

const user = interaction.options.getUser('user');
const member = await interaction.guild.members.fetch(user.id);

if (!member) {
return interaction.reply({
content: "❌ Could not find that user in the server.",
ephemeral: true
});
}

if (member.id === interaction.user.id) {
return interaction.reply({
content: "❌ You cannot mute yourself.",
ephemeral: true
});
}

const minutes = interaction.options.getInteger('minutes');
const reason = interaction.options.getString('reason') || "No reason provided";
const duration = minutes * 60 * 1000;

try {

await member.timeout(duration, reason);

const embed = new EmbedBuilder()
.setColor("#1b2df0")
.setTitle("🔇 User Muted")
.setDescription(`${user.tag} has been **muted**.`)
.addFields(
{ name: "Duration", value: `${minutes} minute(s)`, inline: true },
{ name: "Reason", value: reason }
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
{ name: "Action", value: "Mute", inline: true },
{ name: "Duration", value: `${minutes} minute(s)`, inline: true },
{ name: "Reason", value: reason }
)
.setTimestamp();

logChannel.send({ embeds: [logEmbed] });

}

} catch (err) {
console.error(err);

interaction.reply({
content: "❌ I couldn't mute that user. Check role hierarchy or permissions.",
ephemeral: true
});
}

}
};