import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// The command definition (unchanged)
const commands = [
    {
        name: 'search',
        description: 'Searches for messages in the server.',
        options: [
            {
                name: 'word',
                description: 'The word to search for.',
                type: 3,
                required: true,
            },
            {
                name: 'limit',
                description: 'The minimum character limit for messages.',
                type: 4,
                required: true,
            },
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        // NEW: Read the comma-separated string and split it into an array of IDs.
        const guildIds = process.env.GUILD_IDS.split(',');

        console.log(`Started refreshing application (/) commands for ${guildIds.length} guilds.`);

        // NEW: Loop through each guild ID and deploy the commands.
        for (const guildId of guildIds) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: commands },
            );
            console.log(`Successfully reloaded commands for guild: ${guildId}`);
        }

        console.log('Finished reloading all application (/) commands.');
    } catch (error) {
        console.error('An error occurred during deployment:', error);
    }
})();