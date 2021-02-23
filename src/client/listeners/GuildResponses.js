const contador = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];


const updateCounter = async (client, data) => {
	const dbGuild = await client.database.guilds.get(data.id);
	const channelId = dbGuild.memberCounter.id;
	const message = dbGuild.memberCounter.message;
	
	const guild = client.guilds.cache.get(data.id);
	const members = guild.members.cache.size.toString().split(''); 
	let count = '';
	for (let i = 0; i < members.length; i++) { count += ':' + contador[members[i]] + ':'; }
	const canal = client.guilds.cache.get(data.id).channels.cache.get(channelId);
	canal.setTopic(message.replace('#Count', count));
};

module.exports = class GuildResponses {
	constructor (client) {
		this.client = client;
		this.events = ['guildMemberAdd', 'guildMemberRemove', 'raw'];
	}

	async onGuildMemberAdd (data) {
		let client = this.client
		updateCounter(client, data);
		console.log(data.member)

		const dbGuild = await this.client.database.guilds.get(data.id);
		const channelId = dbGuild.welcomeMessage.id;
		const message = dbGuild.welcomeMessage.message;
		const guild = this.client.guilds.cache.get(data.id);
		const MsgChannel = guild.channels.cache.get(channelId);
		MsgChannel.send(message.replace('#Username', data.member.username));
	}

	async onGuildMemberRemove () {
		updateCounter(this.client);
	}

	/*
	* To fix 
	async onRaw (data) {
		if (data.t !== 'MESSAGE_REACTION_ADD') return;

		const servidor = this.client.guilds.cache.get('500452776770535444');
		const membro = await servidor.members.fetch(data.d.user_id);
		const cargo = await servidor.roles.fetch('671400506245120030');

		if (data.t === 'MESSAGE_REACTION_ADD') {
			if (data.d.emoji.id == '547392151043178506') {
				if (membro.roles.cache.get(cargo)) return;
				membro.roles.add(cargo);
			}
		}
	}
	*/
};