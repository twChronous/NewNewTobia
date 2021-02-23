const { Command, TobiasEmbed, Constants } = require('../../');

const PREFIX_MAX_LENGTH = 5;

module.exports = class ConfigPrefix extends Command {
	constructor(client, path) {
		super(client, path, {
			name: 'prefix',
			category: 'configuration',
			aliases: ['setprefix', 'prefixo'],
			utils: {
				requirements: {
					guildOnly: true,
					databaseOnly: true,
					permissions: ['MANAGE_GUILD']
				},
				parameters: [
					{
						type: 'string',
						full: true,
						required: false,
						maxLength: PREFIX_MAX_LENGTH,
						missingError: 'commands:config.subcommands.prefix.missingPrefix'
					}
				]
			}
		});
	}

	async run({ t, author, channel, guild }, prefix = Constants.DEFAULT_PREFIX) {
		const embed = new TobiasEmbed(author, this.client);
		try {
			await this.client.database.guilds.update(guild.id, { $set: { prefix }}); 
			embed.setTitle(
				t('commands:config.subcommands.prefix.changedSuccessfully', { prefix })
			);
		} catch (e) {
			embed.setColor(Constants.ERROR_COLOR).setDescription(t('errors:generic'));
		}
		channel.send(embed);
	}
};