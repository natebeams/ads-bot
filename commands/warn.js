const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkPerms = require('../checkPerms');
const fs = require('fs');

const MOD_LOG_CHANNEL = "1481114583543316511"; // replace with your log channel ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to warn')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!checkPerms(interaction.member, "warn")) {
      return interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('user');

    let db = JSON.parse(fs.readFileSync('./database.json'));

    if (!db.warns) db.warns = {};
    if (!db.warns[user.id]) db.warns[user.id] = 0;

    db.warns[user.id]++;

    fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor("#1b2df0")
      .setTitle("⚠️ User Warned")
      .setDescription(`${user.tag} has been **warned**.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Moderation Log
    const logChannel = interaction.guild.channels.cache.get(MOD_LOG_CHANNEL);

    if (logChannel) {

      const logEmbed = new EmbedBuilder()
        .setColor("#FF2E2E")
        .setTitle("🚨 Moderation Log")
        .addFields(
          { name: "User", value: `${user.tag} (${user.id})` },
          { name: "Moderator", value: `${interaction.user.tag}` },
          { name: "Action", value: "Warn", inline: true },
          { name: "Total Warns", value: `${db.warns[user.id]}`, inline: true }
        )
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] });

    }

  }
};