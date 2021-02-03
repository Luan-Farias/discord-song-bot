import { Message } from 'discord.js';
import defaultDiscordCommands from '../commands/defaultDiscordCommands';

export default function onMessageHandler(message: Message): void {
    const prefix = 'm!';
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const commandUsed = message.content
        .trim()
        .slice(prefix.length)
        .split(' ')
        .shift()
        .toLocaleLowerCase();

    if (defaultDiscordCommands[commandUsed])
        return defaultDiscordCommands[commandUsed](message);
}
