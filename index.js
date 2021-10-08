// Require the necessary discord.js classes
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
const fs = require("fs");
const ytdl = require("ytdl-core");

client.commands = new Discord.Collection();
const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Login to Discord with your client's token
client.login(token);

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split("/ +/");
    const commands = args.shift().toLowerCase();

    if (commands === "p") {
        client.commands.get("ping").execute(message, args);
    } else if (commands == "skip") {
        message.channel.send("skip song");
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
