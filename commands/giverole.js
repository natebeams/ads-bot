const { SlashCommandBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');

module.exports = {
data: new SlashCommandBuilder()
.setName('giverole')
.setDescription('Give a role to a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User')
.setRequired(true)
)
.addRoleOption(option =>
option.setName('role')
.setDescription('Role to give')
.setRequired(true)
),

async execute(interaction) {

if(!checkPerms(interaction.member, "giverole")){
return interaction.reply({
content: "You don't have permission to use this command.",
ephemeral: true
});
}

const user = interaction.options.getUser('user');
const role = interaction.options.getRole('role');

let member;

try{
member = await interaction.guild.members.fetch(user.id);
}catch{
return interaction.reply({
content: "User not found in this server.",
ephemeral: true
});
}

try{

await member.roles.add(role);

interaction.reply(`Gave **${role.name}** to ${user.tag}`);

}catch(err){

interaction.reply({
content: "I couldn't give that role. Check role hierarchy or permissions.",
ephemeral: true
});

}

}

};