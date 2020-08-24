/* eslint-disable no-undef */
const { CommandContext, TobiasEmbed, Emojis, Constants } = require('../..')

const getPrefix = (m, p) => p.find(pr => m.content.startsWith(pr))

module.exports = class MessageResponse {
  constructor(client) {
    this.client = client;
    this.commands = this.client.commands
    this.events = ['message', 'messageUpdate'];
  }

  onMessageUpdate(oldM, newM) {
    if (oldM.author.bot) return
    if (newM.edits.length <= 2) {
      const inGuild = !!newM.channel.guild
      if (!inGuild) return
      if (oldM.content !== newM.content && newM.content.length) {
        this.client.emit('message', newM, true)
      }
    }
  }

  async onMessage(message) {
    if (message.author.bot) return

    const { prefix, language } = (message.guild
      ? await this.client.database.guilds.get(message.guild.id)
      : {
        prefix: Constants.DEFAULT_PREFIX,
        language: Constants.DEFAULT_LANGUAGE
      }
    );

    if (message.content === `<@${this.client.user.id}>` || message.content === `<@!${this.client.user.id}>`) {
      return message.channel.send(
        TobiasEmbed(message.author)
          .setDescription(`${Emojis.Certo} **${message.author.username}**, ${this.client.language.i18next.getFixedT(language)('client:mentionBot', { prefix: Constants.DEFAULT_PREFIX })}`)
      ).catch(() => { })
    }
    const Prefixes = [prefix, `<@!${this.client.user.id}>`, `<@${this.client.user.id}>`];
    const usedPrefix = getPrefix(message, Prefixes);


    if (usedPrefix && message.content.length > usedPrefix.length) {
      const fullCmd = message.content
        .substring(usedPrefix.length)
        .split(/[ \t]+/)
        .filter(a => a)
      const args = fullCmd.slice(1)

      const aliase = fullCmd[0].toLowerCase().trim()
      const command = this.client.commands.find(
        cmd => cmd.name === aliase || cmd.aliases.includes(aliase)
      )

      if (command) {
        if (message.guild) {
          if (
            !message.channel
              .permissionsFor(this.client.user)
              .has('SEND_MESSAGES')
          ) { return }
        }

        const context = new CommandContext({
          client: this.client,
          instancedTimestamp: Date.now(),
          usedPrefix,
          message,
          command,
          prefix,
          args,
          language,
          aliase,

        })

        context.setFixedT(this.client.language.i18next.getFixedT(language))
        command
          ._run(context, args)
          .catch(e =>
            this.client.log(true, e.stack || e, command.name)
          )
      }
    }
  }
}