// Require the necessary discord.js classes
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");

// Create a new client instance
const client = new Discord.Client()

// Login to Discord with your client's token
client.login(token);

client.once("ready", () => {
    console.log("Ready!");
});
client.once("reconnecting", () => {
    console.log("Reconnecting!");
});
client.once("disconnect", () => {
    console.log("Disconnect!");
});
