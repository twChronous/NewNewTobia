const CommandParameters = require('./utils/CommandParameters')
const CommandRequirements = require('./CommandRequirements')
const CommandError = require('./CommandError')
const Constants = require('../../utils/Constants')
const TobiasEmbed = require('../TobiasEmbed')

module.exports = class Command {
  constructor (client, path, options = {}) {
    this.name = options.name
    this.aliases = options.aliases || []
    this.category = options.category || 'general'
    this.hidden = options.hidden

    this.utils = options.utils || {}

    this.cooldownTime = options.cooldown
    this.cooldown = this.cooldownTime && this.cooldownTime > 0 && new Map()
    this.cooldownFeedback = this.cooldown && true

    Object.defineProperty(this, 'client', { get: () => client })
    Object.defineProperty(this, 'fullPath', { get: () => path })
  }

  get cmd () {
    return this.referenceCommand ? this.referenceCommand.name : this.name
  }

  get capitalizeName () {
    return this.referenceCommand
      ? `${this.referenceCommand.fullName.capitalize()} ${this.name.capitalize()}`
      : this.name.capitalize()
  }

  get fullName () {
    return this.referenceCommand
      ? `${this.referenceCommand.fullName} ${this.name}`
      : this.name
  }

  async _run (context, args) {
    try {
      await this.handleRequirements(context, args)

      args = await this.handleParameters(context, args)
      this.run(context, ...args)

    } catch (e) {
      this.error(context, e)
    }
    return context.channel.stopTyping(true)
  }

  run () {}
 
  handleRequirements (context, args) {
    return this.utils.requirements
      ? CommandRequirements.handle(context, this.utils.requirements, args)
      : true
  }

  handleParameters (context, args) {
    return this.utils.parameters
      ? CommandParameters.handle(context, this.utils.parameters, args)
      : args
  }

   error ({ t, channel, author, prefix }, error) {
    if (error instanceof CommandError) {
      const usage = this.usage(t, prefix)
      const embed =
        error.embed ||
        TobiasEmbed(author)
          .setTitle(error.message)
          .setDescription(error.showUsage ? usage : '')
      channel.send(embed.setColor(Constants.ERROR_COLOR))
    } else {
      this.client.log(true, error.stack || error, `[${this.name}]`)
    }
  }

  usage (t, prefix, noUsage = true, onlyCommand = false) {
    
    const usagePath = `${this.tPath}.commandUsage`
    const usage = noUsage
      ? t(`commands:${usagePath}`)
      : t([`commands:${usagePath}`, ''])
    if (usage !== usagePath && !onlyCommand) {
      return `**${t('commons:usage')}:** \`${prefix}${this.fullName}${
        usage ? ' ' + usage : ''
      }\``
    } else if (usage !== usagePath && onlyCommand) {
      return `${prefix}${this.fullName}${usage ? ' ' + usage : ''}`
    } else {
      return `**${t('commons:usage')}:** \`${prefix}${this.fullName}\``
    }
  }
}