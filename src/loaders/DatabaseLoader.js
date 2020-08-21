/* eslint-disable no-undef */
const MongoDB = require('../database/MongoDB.js')

module.exports = class DataBaseLoader {
    constructor(client) {
        this.client = client;
        this.database = new MongoDB({
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    async start() {
        this.client.database = await this.database
            .connect(this.client)
            .then(() => this.database)
            .catch(e => console.log(e))
        this.client.log(false, 'O Banco de Dados foi carregado com exito.', '[DataBaseLoader]')
        return true;
    }
}