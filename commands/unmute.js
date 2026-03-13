const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');

const LOG_CHANNEL_ID = "1481114583543316511";

module.exports = {
data: new SlashCommandBuilder()
.setName('unmute')
.setDescription('Remove timeout from a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User to unmute')
.setRequired(true)
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

await member.timeout(null);

const embed = new EmbedBuilder()
.setColor("#FF2E2E")
.setTitle("<:StaffBadgeRed:1481520734382719111> Klien Moderation Action")
.setDescription("User unmuted")
.addFields(
{ name: "・Username:", value: `<@${user.id}>` },
{ name: "・Channel:", value: `<#${interaction.channel.id}>` },
{ name: "・Issued By:", value: `<@${interaction.user.id}>` }
)
.setTimestamp();

await interaction.reply({
content: `<@${user.id}>`,
embeds: [embed]
});

const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);

if(logChannel){
logChannel.send({
content: `<@${user.id}>`,
embeds: [embed]
});
}

}
};