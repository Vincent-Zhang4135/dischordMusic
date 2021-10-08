// Require the necessary discord.js classes
const { Client, Attachment } = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const client = new Client();

var servers = {};

/*
client.commands = new Discord.Collection();
const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}*/

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", (message) => {
    if (!message.content.startsWith(prefix)) return;

    let args = message.content.substring(prefix.length).split(" ");

    switch (args[0]) {
        case "p":
            function play(connection, message) {
                var server = servers[message.guild.id];

                stream = ytdl(server.queue[0], { filter: "audioonly" });
                server.dispatcher = connection.play(stream);

                server.queue.shift();

                server.dispatcher.on("end", () => {
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
            if (!message.member.voice.channel) {
                message.channel.send("please be in a channel!");
                return;
            }

            // check to see that the queue is not blank, and if it is, create an empty queue
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = { queue: [] };
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            // check to see that the bot is on a server, and if it is not, join it.
            if (!message.guild.voiceConnection) {
                message.member.voice.channel.join().then((connection) => {
                    play(connection, message);
                    message.channel.send("currently playing...");
                });
            }

            break;

        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) {
                server.dispatcher.end();
            }
            message.channel.send("skipping current song");

            break;

        case "disconnect":
            var server = servers[message.guild.id];
            if (message.guild.voice.connection) {
                for (let i = server.queue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                message.channel.send("Bye! disconnecting...");
                console.log("disconnect");
            }

            if (message.guild.connection) {
                message.guild.voice.connection.disconnect();
            }
    }
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});
client.once("disconnect", () => {
    console.log("Disconnect!");
});

client.login(token);
