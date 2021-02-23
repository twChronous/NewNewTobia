/* eslint-disable no-mixed-spaces-and-tabs */
const { Status, Constants } = require('../../');

const PRESENCE_TYPES = Object.keys(Status);
const PRESENCE_INTERVAL = 160 * 1000;

const parseStatus = (type, name) => {
	return {
		status: 'online',
		userID: '539853186572222464',
		activity: { name, url: 'https://www.twitch.tv/twchronous', type }
	};
};
module.exports = class WebSocketResponses {
	constructor(client) {
		this.client = client;
		this.events = ['ready', 'error'];
	}

	replaceInformations(expr = '@{client} help') {
		const { guilds, users, user } = this.client;
		return expr
			.replace('{guilds}', guilds.cache.size)
			.replace('{users}', users.cache.size)
			.replace('{client}', user.username)
			.replace('{prefix}', Constants.DEFAULT_PREFIX);
	}

	async onReady() {
		const updateStatus = () => {
			const presenceType = PRESENCE_TYPES[Math.floor(Math.random() * PRESENCE_TYPES.length)];
			const presence = Status[presenceType][Math.floor(Math.random() * Status[presenceType].length)];
			this.client.user.setPresence(
				parseStatus(presenceType, this.replaceInformations(presence))
			);
		};

		setInterval(updateStatus, PRESENCE_INTERVAL);
		return updateStatus();
	}
};