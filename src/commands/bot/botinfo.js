const { 
	Command,
	TobiasEmbed,
	Constants } = require('../../');

module.exports = class BotInfo extends Command {
	constructor(client, path) {
		super(client, path, {
			name: 'botinfo',
			category: 'bot',
			aliases: [
				'bi', 'botinformation', 'info', 'invite'
			]
		});
	}

	run({ t, channel, author }) {
		const embed = new TobiasEmbed(author, this.client)
			.setTitle(this.client.user.username)
			.setThumbnail(this.client.user.displayAvatarURL() || this.client.user.avatarURL());

		embed
			.setDescription(t('commands:bot.ctx'))
			.addField(t('commands:bot.users'), this.client.users.cache.size, false)
			.addField(t('commands:bot.guilds'), this.client.guilds.cache.size, false)
			.addField(t('commands:bot.languages'), this.client.language.langs.map(e => e.name()), false)
			.addField(t('commands:bot.addMe'), t('commands:bot.click', { LINK: Constants.BOT_LINKS.ADD_ME }), true)
			.addField(t('commands:bot.voteMe'), t('commands:bot.click', { LINK: Constants.BOT_LINKS.ADD_ME }), true);
		channel.send(embed);
	}
};