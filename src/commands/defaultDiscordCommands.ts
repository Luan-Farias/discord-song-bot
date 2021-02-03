import { Message, MessageEmbed } from 'discord.js';
import connectionModel from '@database/models/Connection';
import createSong from '../functions/createSong';
import playSongs from '../functions/playSongs';
import youtubeSearch from '../functions/youtubeSearch';
import client from '../discord.client';
import Post from '@database/models/Post';

const defaultDiscordCommands = {
    ping: (message: Message): void => {
        message.reply(`Essa mensagem tem latência de ${Date.now() - message.createdTimestamp}`);
    },
    help: (message: Message): void => {
        message.reply('Eu não te devo explicações não ow seu paiaço');
    },
    play: async (message: Message): Promise<void> => {
        const connectionDatabase = await connectionModel.findOne({
            guild_id: message.guild.id,
        });

        const args = message.content.split(' ').slice(1);
        if(args.length === 0) return;

        const song = createSong();
        song.type = 'url';
        if (args[0].startsWith('https://www.youtube.com/watch') || args[0].startsWith('https://youtu.be/')) {
            song.callback = args[0];
            song.name = args[0];
            message.reply(`Added ${song.name} to the queue`);
        } else {
            const youtubeSong = await youtubeSearch(args.join(' '));
            song.callback = youtubeSong.callback;
            song.name = youtubeSong.name;
        }

        if (connectionDatabase) {
            connectionDatabase.songs.push(song);
            await connectionDatabase.save();
            message.reply(`Added ${song.name} to the queue`);
            return;
        }

        if (!message.member.voice.channel) {
            message.reply('You need to join a voice channel first!');
            return;
        }

        const createdConnection = await connectionModel.create({
            guild_id: message.guild.id,
            current: -1,
            songs: [song],
            queue: false,
            song: false
        });

        try {
            const connection = await message.member.voice.channel.join();
            connection.on('disconnect', async () => {
                await connectionModel.deleteOne({ guild_id: message.guild.id });
            });
            playSongs(message.guild.id);
            message.reply(`Playing ${song.name} in ${connection.channel.name}!`);
        } catch {
            await createdConnection.delete();
        }
    },
    dis: (message: Message): void => {
        const connection = client.voice.connections.find((item, key) => key === message.guild.id);

        if (connection) return connection.disconnect();
    },
    defaults: async (message: Message): Promise<void> => {
        const defaultSongs = await Post.find().sort([['createdAt', 'asc']]);
        const exampleEmbed = new MessageEmbed()
            .setColor('#bd93f9')
            .setTitle('List of default songs')
            .setAuthor(
                'Music Dash',
                'https://cdn.discordapp.com/avatars/803388638707712062/89a2044e7a47469453c74e1ae80f6a39.png?size=256'
            )
            .setDescription('List of Default Songs')
            .addFields(
                defaultSongs.map((item, key) => {
                    const value = {
                        name: `Song ${key}`,
                        value: item.name,
                    };

                    return value;
                })
            );
        message.channel.send(exampleEmbed);
    },
    default: async (message: Message): Promise<void> => {
        if (!process.env.PERMITED_IDS.split(',').includes(message.member.id))
            return;

        const connectionDatabase = await connectionModel.findOne({
            guild_id: message.guild.id,
        });

        const index = Number(message.content.split(' ')[1]);
        const defaultSongs = await Post.find().sort([['createdAt', 'asc']]);

        const defaultSong = defaultSongs[index];
        if(!defaultSong) return;

        const song = createSong();
        song.type = 'default';
        song.callback = defaultSong.key;
        song.name = defaultSong.name;

        if (connectionDatabase) {
            connectionDatabase.songs.push(song);
            await connectionDatabase.save();
            message.reply(`Added ${song.name} to the queue`);
            return;
        }

        if (!message.member.voice.channel) {
            message.reply('You need to join a voice channel first!');
            return;
        }

        const createdConnection = await connectionModel.create({
            guild_id: message.guild.id,
            current: -1,
            songs: [song],
            queue: false,
            song: false
        });

        try {
            const connection = await message.member.voice.channel.join();
            connection.on('disconnect', async () => {
                await connectionModel.deleteOne({ guild_id: message.guild.id });
            });
            await playSongs(message.guild.id);
            message.reply(`Playing ${song.name} in ${connection.channel.name}!`);
        } catch {
            await createdConnection.delete();
        }
    },
    loop: async (message: Message): Promise<void> => {
        const connectionDatabase = await connectionModel.findOne({
            guild_id: message.guild.id,
        });

        connectionDatabase.song = true;
        connectionDatabase.queue = false;
        await connectionDatabase.save();
        message.reply('The song will play in loop');
    },
    loopqueue: async (message: Message): Promise<void> => {
        const connectionDatabase = await connectionModel.findOne({
            guild_id: message.guild.id,
        });

        connectionDatabase.queue = true;
        connectionDatabase.song = false;
        await connectionDatabase.save();
        message.reply('The queue will play in loop');
    },
    p: async (message: Message): Promise<void> => defaultDiscordCommands.play(message),
    l: async (message: Message): Promise<void> => defaultDiscordCommands.loop(message),
    lq: async (message: Message): Promise<void> => defaultDiscordCommands.loopqueue(message),
};

export default defaultDiscordCommands;
