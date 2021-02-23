const { Command, TobiasEmbed, Constants} = require('../../');

const msgTimeOut = async (msg, time) => {
	await new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
	return msg.reactions.removeAll().catch(() => { });
};

module.exports = class ban extends Command {
	constructor (client, path) {
		super(client, path, {
			name: 'ban',
			category: 'moderation',
			aliases: ['banir'],
			utils: {
				requirements: {
					guildOnly: true,
					permissions: ['BAN_MEMBERS'],
					botPermissions: ['BAN_MEMBERS']
				},
				parameters: [
					{
						type: 'member',
						acceptBot: true,
						missingError: 'commands:ban.missingUser'
					},
					{
						type: 'string',
						required: false,
						full: true,
						missingError: 'commands:ban.missingReason'
					}
				]
			}
		});
	}

	async run ({ t, author, channel, guild }, member, reason = t('commons:texts.notDefined')) {
		const embed = new TobiasEmbed(author, this.client);
      
		embed
			.setDescription(t('commands:ban.txt'));
		channel.send(embed).then(async (msg) => {
			await msg.react('⏰');
			await msg.react('♾️');
			const initializeCollector = (msg.createReactionCollector(
				(reaction, user) => ['⏰', '♾️'].includes(reaction.emoji.name) &&
                user.id === author.id,
				{ time: 120000 })
			);

			msgTimeOut(msg, 120000);
			return initializeCollector.on('collect', async (r) => {
				if (r.emoji.name == '⏰') {
					guild.ban(member, { days: 7, reason }).then(
						bannedMember => {
							msg.reactions.removeAll().catch(() => { });
							msg.edit(embed
								.setThumbnail(member.user.displayAvatarURL)
								.setTitle(t('commands:ban.successTitle'))
								.setDescription(`${bannedMember} - \`${reason}\``)
							);
						}).catch(err => {
						embed
							.setColor(Constants.ERROR_COLOR)
							.setTitle(t('commands:ban.cantBan'))
							.setDescription(`\`${err}\``);
					});
				}
				if (r.emoji.name == '♾️') {
					guild.ban(member, { reason }).then(
						bannedMember => {
							msg.reactions.removeAll().catch(() => { });
							msg.edit(embed
								.setThumbnail(member.user.displayAvatarURL)
								.setTitle(t('commands:ban.successTitle'))
								.setDescription(`${bannedMember} - \`${reason}\``)
							);
						}).catch(err => {
						embed
							.setColor(Constants.ERROR_COLOR)
							.setTitle(t('commands:ban.cantBan'))
							.setDescription(`\`${err}\``);
					});
				}
			});
		});
	}
};
