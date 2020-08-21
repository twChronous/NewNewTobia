const { Client } = require('discord.js');
const { red, blue, magenta } = require('chalk');
const moment = require('moment')
const loaders = require('./loaders')

const getDate = () => moment.locale('pt-BR') && moment().format('lll')

module.exports = class TobiasClient extends Client {
  constructor() {
    super('tobias');
    this.database = null
    this.language = null
  }

  login(token) { 
    super.login(token)
      .then(() => this.log(false,'O Tobias foi conectado com sucesso ao Discord','[Client]'))
  }

  log(error, message, name) {
    if(!name) name = ''
    const isError =  error ? red('[Error]') : blue('[Success]')
    console.log(`\x1b[32m[${getDate()}]\x1b[0m${isError} ${message} ${magenta(name)}`);
  }

  async loaders() {
    for (const Loader of Object.values(loaders)) {
      const loader = new Loader(this);

      try {
        await loader.start();
      } catch (error) {
        this.log(true,error);
        return false;
      }
    }
  }
}