const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

const GUILD_ID = '1218195731115147284';

app.get('/api/members', async (req, res) => {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        const members = await guild.members.fetch();
        
        const memberData = members.map(member => ({
            id: member.user.id,
            username: member.user.username,
            avatar_url: member.user.displayAvatarURL({ dynamic: true }),
            status: member.presence?.status || 'offline',
            roles: member.roles.cache.map(role => ({
                id: role.id,
                name: role.name,
                color: role.hexColor
            })),
            game: member.presence?.activities[0] ? {
                name: member.presence.activities[0].name,
                type: member.presence.activities[0].type
            } : null
        }));

        res.json(memberData);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

client.on('ready', () => {
    console.log('Discord bot is ready!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

client.login(process.env.DISCORD_BOT_TOKEN); 