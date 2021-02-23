const { Command, Utils, Constants, TobiasEmbed } = require('../../');

module.exports = class Slap extends Command {
	constructor (client, path) {
		super(client, path, {
			name: 'slap',
			category: 'fun',
			aliases: ['tapa'],
			utils: {
				requirements: { guildOnly: true, apis: ['nekos'] },
				parameters: [
					{ type: 'user', missingError: 'commands:slap.missingUser' }
				]
			}
		});
	}

	async run ({ t, author, channel, userHuged }, user) {
		const hugImage = await this.client.apis.nekos.getImage('slap');
		const embed = new TobiasEmbed(author, this.client)
			.setImage(hugImage)
			.setDescription(t('commands:slap.successSlap', { author: author.tag, user: user.tag }))
			.setColor(Constants.EMBED_COLOR);

		const channelPromise = userHuged
			? userHuged.edit(embed)
			: channel.send(embed);
		channelPromise.then(m => {
			if (userHuged) return;
			m.react('🔄').then(() => {
				const filter = (r, u) => r.emoji.name === '🔄' && u.id === user.id;
				return Utils.reactionCollectorResponse(m, filter, {
					time: 60000,
					clear: true
				}).then(result => {
					if (result) { this.run({ t, author: user, channel, userHuged: m }, author); }
				});
			});
		});
	}
};