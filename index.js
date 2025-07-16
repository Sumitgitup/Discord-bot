// --- BOT AND LIBRARIES SETUP ---
// NEW: Import 'Events' for the interaction listener
import { Client, GatewayIntentBits, ChannelType, Events } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// --- API SERVER SETUP ---
const app = express();
const PORT = 3000;
app.use(express.json());


// --- DISCORD BOT SETUP ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// --- THE CORE SEARCH FUNCTION (Unchanged) ---
async function searchMessages(word, limit, channelId) {
    // ... (Your existing searchMessages function goes here, no changes needed)
    const results = [];
    if (channelId) {
        try {
            const channel = await client.channels.fetch(channelId);
            if (channel && channel.type === ChannelType.GuildText && channel.viewable) {
                const messages = await channel.messages.fetch({ limit: 100 });
                const foundMessages = messages.filter(msg =>
                    msg.content.toLowerCase().includes(word.toLowerCase()) &&
                    msg.content.length > Number(limit)
                );
                foundMessages.forEach(msg => {
                    results.push({
                        messageId: msg.id,
                        text: msg.content,
                        messageUrl: `https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`
                    });
                });
            }
        } catch(error) { console.error(error); }
    } else {
        const promises = [];
        client.guilds.cache.forEach(guild => {
            guild.channels.cache.forEach(channel => {
                if (channel.type === ChannelType.GuildText && channel.viewable) {
                    promises.push(
                        channel.messages.fetch({ limit: 100 })
                            .then(messages => ({ messages, channel, guild }))
                            .catch(() => null)
                    );
                }
            });
        });
        const allMessagePayloads = await Promise.all(promises);
        allMessagePayloads.forEach(payload => {
            if (!payload) return;
            const { messages, channel, guild } = payload;
            const foundMessages = messages.filter(msg =>
                msg.content.toLowerCase().includes(word.toLowerCase()) &&
                msg.content.length > Number(limit)
            );
            foundMessages.forEach(msg => {
                results.push({
                    messageId: msg.id,
                    text: msg.content,
                    messageUrl: `https://discord.com/channels/${guild.id}/${channel.id}/${msg.id}`
                });
            });
        });
    }
    return results;
}

// --- API ENDPOINT (Unchanged) ---
app.post('/search', async (req, res) => {
    // ... (Your existing API endpoint code goes here, no changes needed)
    const { word, limit, channelId } = req.body;
    if (!word || limit === undefined) {
        return res.status(400).json({ error: 'Missing "word" or "limit" in request' });
    }
    try {
        const searchResults = await searchMessages(word, limit, channelId);
        res.json(searchResults);
    } catch (error) {
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

// --- NEW: SLASH COMMAND HANDLER ---
client.on(Events.InteractionCreate, async interaction => {
    // Ignore any interactions that aren't slash commands.
    if (!interaction.isChatInputCommand()) return;

    // Check if the command is our '/search' command.
    if (interaction.commandName === 'search') {
        // Get the options the user provided.
        const word = interaction.options.getString('word');
        const limit = interaction.options.getInteger('limit');

        // Defer the reply. Discord requires a response within 3 seconds.
        // Since our search might take longer, this tells Discord "I'm working on it!"
        await interaction.deferReply({ ephemeral: true }); // ephemeral means only the user who ran the command can see the reply.

        try {
            // Run the same search function we use for the API.
            const searchResults = await searchMessages(word, limit);

            if (searchResults.length === 0) {
                await interaction.editReply('No messages found matching your criteria.');
                return;
            }

            // Format the results into a clean string.
            let replyContent = `Found ${searchResults.length} messages:\n\n`;
            searchResults.slice(0, 5).forEach(result => { // Limit to showing first 5 results
                replyContent += `[Link to message](${result.messageUrl})\n> "${result.text.slice(0, 100)}..."\n\n`;
            });

            // Edit the original "thinking..." message to show the results.
            await interaction.editReply(replyContent);

        } catch (error) {
            console.error('Error handling slash command:', error);
            await interaction.editReply('An error occurred while running the search.');
        }
    }
});


// --- START BOT AND SERVER ---
client.once('ready', () => {
    console.log(`Bot is online! Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

app.listen(PORT, () => {
    console.log(`API server is running on http://localhost:${PORT}`);
});