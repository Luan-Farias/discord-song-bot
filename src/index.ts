import 'dotenv/config';

import './database/connection';
import app from './app';
import client from './discord.client';
import onMessageHandler from '@handlers/onMessageHandler';

const server = app.listen(app.get('port'), () => {
    console.log(`🚀 Server running on the port ${Object(server.address()).port}`);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', onMessageHandler);

client.login(process.env.DISCORD_TOKEN);
