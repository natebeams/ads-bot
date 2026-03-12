const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');

const MOD_LOG_CHANNEL = "1481114583543316511"; // replace with your log channel ID

module.exports = {
data: new SlashCommandBuilder()
.setName('ban')
.setDescription('Ban a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User to ban')
.setRequired(true)
)
.addStringOption(option =>
option.setName('reason')
.setDescription('Reason for the ban')
.setRequired(false)
),

async execute(interaction) {

if(!checkPerms(interaction.member, "ban")){
return interaction.reply({
content: "You don't have permission to use this command.",
ephemeral: true
});
}

const user = interaction.options.getUser('user');
const member = interaction.guild.members.cache.get(user.id);

const reason = interaction.options.getString('reason') || "No reason provided";

await member.ban({ reason });

const embed = new EmbedBuilder()
.setColor("#2b2d31")
.setTitle("🔨 User Banned")
.setDescription(`${user.tag} has been **banned**.`)
.addFields(
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
{ name: "Action", value: "Ban", inline: true },
{ name: "Reason", value: reason }
)
.setTimestamp();

logChannel.send({ embeds: [logEmbed] });

}

}
};