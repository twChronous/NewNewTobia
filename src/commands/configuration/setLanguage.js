const { Command, TobiasEmbed, Emojis } = require('../../');

const msgTimeOut = async (msg, time) => {
	await new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
	return msg.reactions.removeAll().catch(() => { });
};

module.exports = class ConfigPrefix extends Command {
	constructor(client, path) {
		super(client, path, {
			name: 'language',
			category: 'configuration',
			aliases: ['setlanguage', 'lingua', 'idioma'],
			utils: {
				requirements: {
					guildOnly: true,
					databaseOnly: true,
					permissions: ['MANAGE_GUILD']
				}
			}
		});
	}
	async run({ t, author, channel, guild }) {
		try {
			const embed = new TobiasEmbed()
				.setTitle(t('commands:language.title'))
				.setDescription(t('commands:language.txt'))
				.addField(t('commands:language.PT'), Emojis.BR)
				.addField(t('commands:language.US'), Emojis.US);

			channel.send(embed)
				.then(async (msg) => {
					await msg.react(Emojis.US);
					await msg.react(Emojis.BR);

					//await this.client.database.guilds.get(guild.id).then(e => e.language === 'pt-BR')

					const filter = (reaction, user) => [Emojis.BR, Emojis.US].includes(reaction.emoji.name) && user.id === author.id;
					const collector = msg.createReactionCollector(filter, { time: 10000 });
					const Newembed = new TobiasEmbed();

					msgTimeOut(msg, 10000);
					collector.on('collect', async r => {

						switch (r.emoji.name) {
								
						case Emojis.BR:
							await this.client.database.guilds.update(guild.id, { $set: { language: 'pt-BR' } });
							Newembed
								.setTitle(t('commands:language.title'))
								.addField(t('commands:language.txt1'), Emojis.BR);
							msg.edit(Newembed);
							break;

						case Emojis.US:
							await this.client.database.guilds.update(guild.id, { $set: { language: 'en-US' } });
							Newembed
								.setTitle(t('commands:language.title'))
								.addField(t('commands:language.txt1'), Emojis.US);
							msg.edit(Newembed);
							break;
						}
					});
				});
		} catch (e) {
			channel.send(t('errors:generic'));
			console.log(e);
		}
	}
};