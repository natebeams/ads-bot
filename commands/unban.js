const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');

const LOG_CHANNEL_ID = "1481114583543316511";

module.exports = {
data: new SlashCommandBuilder()
.setName('unban')
.setDescription('Unban a user')
.addStringOption(option =>
option.setName('userid')
.setDescription('User ID to unban')
.setRequired(true)
),

async execute(interaction) {

if(!checkPerms(interaction.member, "ban")){
return interaction.reply({
content: "You don't have permission to use this command.",
ephemeral: true
});
}

const userId = interaction.options.getString('userid');

await interaction.guild.members.unban(userId);

const embed = new EmbedBuilder()
.setColor("#FF2E2E")
.setTitle("<:StaffBadgeRed:1481520734382719111> Klien Moderation Action")
.setDescription("User unbanned")
.addFields(
{ name: "・User ID:", value: userId },
{ name: "・Channel:", value: `<#${interaction.channel.id}>` },
{ name: "・Issued By:", value: `<@${interaction.user.id}>` }
)
.setTimestamp();

await interaction.reply({
embeds: [embed]
});

const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);

if(logChannel){
logChannel.send({
embeds: [embed]
});
}

}
};