/* eslint-disable no-undef */
require('dotenv').config()
const Tobias = require('./src/Tobias');
const client = new Tobias();

client.loaders().then(() => client.login(process.env.DISCORD_TOKEN))