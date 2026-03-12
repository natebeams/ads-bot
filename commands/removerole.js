const { SlashCommandBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');

module.exports = {
data: new SlashCommandBuilder()
.setName('removerole')
.setDescription('Remove a role from a user')
.addUserOption(option =>
option.setName('user')
.setDescription('User')
.setRequired(true)
)
.addRoleOption(option =>
option.setName('role')
.setDescription('Role to remove')
.setRequired(true)
),

async execute(interaction) {

if(!checkPerms(interaction.member, "removerole")){
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

if(!member.roles.cache.has(role.id)){
return interaction.reply({
content: `${user.tag} does not have the **${role.name}** role.`,
ephemeral: true
});
}

try{

await member.roles.remove(role);

interaction.reply(`Removed **${role.name}** from ${user.tag}`);

}catch(err){

interaction.reply({
content: "I couldn't remove that role. Check role hierarchy or permissions.",
ephemeral: true
});

}

}

};