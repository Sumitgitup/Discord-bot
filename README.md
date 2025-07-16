# Discord Server Search Bot & API

A powerful and flexible Discord bot designed to search for messages across an entire server based on keywords and character length. This project features a dual interface: a user-friendly slash command for server members and a robust REST API for programmatic integration.


## 🌟 Overview

This project combines two powerful functionalities into a single, efficient Node.js application:

1.  **A Discord Bot:** Built with `discord.js`, the bot connects to Discord's real-time gateway. It has the core logic to efficiently scan through channels, fetch messages, and filter them according to user-defined criteria.
2.  **A Web API:** Built with `Express.js`, the application hosts a web server with a `/search` endpoint. This allows external services, applications, or scripts to trigger a message search and receive the results in a clean JSON format.

This hybrid approach makes the bot ideal for both direct use within a Discord community and for building more complex integrations and automations.

## ✨ Features

-   **Comprehensive Message Search:** Scans all readable text channels within a server.
-   **Keyword Filtering:** Pinpoints messages containing a specific word (case-insensitive).
-   **Length Filtering:** Narrows down results to messages exceeding a minimum character count.
-   **Dual Interface:**
    -   **`/search` Slash Command:** Provides an intuitive way for server members to perform searches directly in Discord.
    -   **`/search` API Endpoint:** Enables programmatic control for developers and external tools.
-   **Targeted API Search:** The API supports an optional `channelId` parameter for high-speed, targeted searches in a single channel.
-   **Direct Message Links:** Every search result includes a direct, clickable URL that takes you straight to the message in Discord.
-   **Multi-Server Deployment:** The command deployment script is designed to easily register and manage slash commands across multiple servers.
-   **Efficient & Asynchronous:** Uses `Promise.all` to handle multiple channel fetches concurrently, ensuring speed and reliability without blocking the application.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/en/) (v18.x or higher is recommended)
-   [npm](https://www.npmjs.com/) (comes bundled with Node.js)

## 🚀 Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

First, clone this repository to your local machine.

```bash
git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
cd your-repository-name

2. Install Dependencies

Navigate into the project directory and run npm install to download all the required libraries from package.json.

npm install

3. Configure Environment Variables

This project uses a .env file to securely store your secret credentials. Create a file named .env in the root of your project and populate it with the following variables:

# Your Bot's unique authentication token
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE

# Your Application's unique ID
CLIENT_ID=YOUR_APPLICATION_CLIENT_ID_HERE

# Comma-separated list of Server IDs (no spaces)
GUILD_IDS=YOUR_SERVER_ID_1,YOUR_SERVER_ID_2

Where to find these values:

    DISCORD_TOKEN: Go to the Discord Developer Portal → Your Application → Bot tab → Click Reset Token.

    CLIENT_ID: In the Developer Portal → Your Application → General Information page → Copy the APPLICATION ID.

    GUILD_IDS: In Discord, first enable Developer Mode (User Settings → Advanced → Developer Mode). Then, right-click on a server icon and select Copy Server ID. You can add multiple IDs separated by commas.

4. Deploy Slash Commands

Before starting the bot, you must register its slash commands with Discord. This only needs to be done once, or whenever you change the command definitions.

Run the deployment script from your terminal:

node deploy-commands.js

You should see a success message confirming that the commands have been reloaded for the guilds specified in your .env file.
5. Start the Application

You are now ready to start the bot and the API server.

node index.js

If everything is configured correctly, you will see two confirmation messages in your console:

Bot is online! Logged in as YourBot#1234
API server is running on http://localhost:3000

⚙️ Usage

You can interact with the bot in two primary ways:
1. Slash Command (in Discord)

In any channel of a server where the bot has been added and the commands have been deployed, type /search to begin.

Syntax:
/search word:<search-term> limit:<min-char-count>

Example:
/search word:announcement limit:100

The bot will provide a private (ephemeral) response visible only to you, listing the messages that match your criteria.
2. API Endpoint

For programmatic control, you can send POST requests to the /search endpoint.

URL: http://localhost:3000/search
Method: POST
Headers: Content-Type: application/json
Example 1: Broad Search (All Channels)

This will search all channels in all servers the bot is in.

curl -X POST http://localhost:3000/search \
-H "Content-Type: application/json" \
-d '{"word": "project", "limit": 50}'

Example 2: Targeted Search (Specific Channel)

This is much faster and only searches in the specified channel.

curl -X POST http://localhost:3000/search \
-H "Content-Type: application/json" \
-d '{"word": "meeting", "limit": 20, "channelId": "123456789012345678"}'

Successful Response Format

A successful API call will return a JSON array of message objects.

[
  {
    "messageId": "123456789012345678",
    "text": "This is a long message about the project and its requirements.",
    "messageUrl": "[https://discord.com/channels/YOUR_SERVER_ID/YOUR_CHANNEL_ID/123456789012345678](https://discord.com/channels/YOUR_SERVER_ID/YOUR_CHANNEL_ID/123456789012345678)"
  }
]

📂 Project Structure

A brief overview of the key files in this repository.

.
├── .env                # Stores all secret credentials (ignored by git)
├── .gitignore          # Specifies files for git to ignore
├── deploy-commands.js  # Script to register slash commands with Discord
├── index.js            # Main application file (runs the bot and API server)
├── package.json        # Project metadata and dependencies
└── package-lock.json   # Records exact versions of dependencies
