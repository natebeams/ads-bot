const checkPerms = require('../checkPerms'); 
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
data: new SlashCommandBuilder()
.setName('ticketpanel')
.setDescription('Send the support ticket panel'),

async execute(interaction) {

const embed = new EmbedBuilder()
.setColor("#0A1AFF")
.setTitle("🎫 Klien Advertising Support")
.setDescription(
"Need assistance? Want to report a user?\n\nClick the button below to open a **support ticket**.\nA staff member will assist you shortly."
)
.setFooter({ text: "Support System" })
.setTimestamp();

const row = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("create_ticket")
.setLabel("Create Ticket")
.setStyle(ButtonStyle.Primary)
);

// send panel in channel
await interaction.channel.send({
embeds: [embed],
components: [row]
});

// confirm to staff
await interaction.reply({
content: "✅ Ticket panel sent.",
ephemeral: true
});

}
};