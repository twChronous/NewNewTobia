/* eslint-disable no-unused-vars */
const { FileUtils } = require('../')

module.exports = class CommandsLoader {
  constructor(client) {
    this.client = client
    this.commandos = []
  }

  async start() {
      FileUtils('src/commands', async ({ file, fullPath, required: NewCommand }) => {
      var command = new NewCommand(this.client, fullPath)
      await this.commandos.push(command)
      this.client.commands = await this.commandos;
    })
  }
}