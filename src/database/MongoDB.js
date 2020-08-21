/* eslint-disable no-undef */
const mongoose = require('mongoose')
const { GuildRepository, UserRepository, CommandoRepository, ClientRepository } = require('./repositories');

module.exports = class MongoDB {
  constructor (options = {}) {
    this.options = options
    this.mongoose = mongoose
  }

  async connect () {
    return mongoose
      .connect(process.env.MONGODB_URI, this.options)
      .then((m) => this.loadSchemas(m))
  }

  async loadSchemas (m) {
        this.guilds = new GuildRepository(m);
        this.users = new UserRepository(m);
        this.comandos = new CommandoRepository(m);
        this.clientUtils = new ClientRepository(m);
  }
}