require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const MOD_LOG_CHANNEL = "1481114583543316511";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const adChannels = [
"1481150969000755293",
"1481151041314754661",
"1481151167827546204",
"1481115707575107635",
"1481115791565783160",
"1481115860495237321",
"1481116181472743514",
"1481116283687665814",
"1481115169299103834",
"1481115381698531429",
"1481118870822453279",
"1481127112407777442",
"1481127381711192064",
"1481127038541627502",
"1481127172717416489",
"1481128318446211093",
"1481128435001852037",
"1481128656393732117"
];

/* STORES LAST STICKY MESSAGE PER CHANNEL */
const stickyMessages = {};

client.once('ready', () => {
    console.log(`Bot online as ${client.user.tag}`);
});

client.on('messageCreate', async message => {

    if (message.author.bot) return;

    if (!adChannels.includes(message.channel.id)) return;

    try {

        /* DELETE OLD STICKY */
        if (stickyMessages[message.channel.id]) {
            const oldMsg = await message.channel.messages.fetch(stickyMessages[message.channel.id]).catch(() => null);
            if (oldMsg) await oldMsg.delete();
        }

        /* CREATE NEW STICKY EMBED */
        const embed = new EmbedBuilder()
        .setColor("#0d1fe9")
        .setTitle("📢 Auto Ads Reminder")
        .setDescription("Post your **server ads below!**\nPlease follow the ad rules and avoid spamming.")
        .setTimestamp();

        const sticky = await message.channel.send({ embeds: [embed] });

        stickyMessages[message.channel.id] = sticky.id;

    } catch (error) {
        console.error("Sticky message error:", error);
    }

});

client.on('interactionCreate', async interaction => {

    /* SLASH COMMAND HANDLER */

    if (interaction.isChatInputCommand()) {

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Error executing command', ephemeral: true });
        }

    }

    /* TICKET BUTTON SYSTEM */

    if (interaction.isButton()) {

        if (interaction.customId === "create_ticket") {

            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: 0,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel']
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel','SendMessages','ReadMessageHistory']
                    }
                ]
            });

            const embed = new EmbedBuilder()
            .setColor("#0050f1")
            .setTitle("🎫 Support Ticket")
            .setDescription("Need assistance? Want to report a user? A staff member will assist you shortly.")
            .setTimestamp();

            await channel.send({
                content: `<@${interaction.user.id}>`,
                embeds: [embed]
            });

            await interaction.reply({
                content: `✅ Your ticket has been created: ${channel}`,
                ephemeral: true
            });

        }

    }

});

client.login(process.env.TOKEN);