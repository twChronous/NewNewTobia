//const { Status, Constants } = require('../..')

module.exports = class ThirdPartyResponse {
    constructor(client) {
        this.client = client
        this.events = ['ready']
    }

    onReady() {
        const updateStatus = () => {
            this.client.user.setPresence({ 
                 activity: { 
                     name: 'Voltei Poar',
                     type: 'WATCHING',
                     url: 'https://www.twitch.tv/twchronous'
                        },
                 status: 'dnd' 
                }
            )
        }
        return updateStatus()
    }
}
