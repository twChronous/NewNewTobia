const { MessageEmbed } = require('discord.js');
const Constants = require('../utils/Constants');

const retractValue = new MessageEmbed();

const TobiasEmbed = (user) => (
  retractValue.setColor(Constants.EMBED_COLOR),
  user ? retractValue.setFooter(user.username, user.displayAvatarURL()) : retractValue.setFooter('')
)

module.exports = TobiasEmbed;