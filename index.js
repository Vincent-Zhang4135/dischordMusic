// Require the necessary discord.js classes
const { Client, Attachment } = require("discord.js");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const client = new Client();

let servers = {};

/*
client.commands = new Discord.Collection();
const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}*/

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.substring(prefix.length).split(" ");

    switch (args[0]) {
        case "p":
            function play(connection, message) {
                let server = servers[message.guild.id];

                server.dispatcher = connection.playStream(
                    ytdl(server.queue[0], { filter: "audioonly" })
                );

                server.queue.shift();

                server.dispatch.on("end", () => {
                    if (server.queue[0]) {
                        play(connection, message);
                    } else {
                        connection.disconnect;
                    }
                });
            }

            // check that the command has a link included in it
            if (!args[1]) {
                message.channel.send("please provide a link!");
                return;
            }

            // check that the person typing the command is in a voice channel
            if (!message.member.voiceChannel) {
                message.channel.send("please be in a channel!");
                return;
            }

            // check to see that the queue is not blank, and if it is, create an empty queue
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = { queue: [] };
            }

            let server = servers[message.guild.id];

            server.queue.push(args[1]);

            // check to see that the bot is on a server, and if it is not, join it.
            if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then((connection) => {
                    play(connection, message);
                });
            }
            break;
    }
});

client.once("ready", () => {
    console.log("Ready!");
});
client.once("reconnecting", () => {
    console.log("Reconnecting!");
});
client.once("disconnect", () => {
    console.log("Disconnect!");
});

client.login(token);
