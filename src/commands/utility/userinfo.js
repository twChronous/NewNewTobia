/* eslint-disable no-undef */
const moment = require('moment')
const { Command, Emojis, Constants } = require('../../')
const { MessageEmbed } = require('discord.js');

const msgTimeOut = async (msg, time) => {
  await new Promise(resolve => {
    setTimeout(resolve, time)
  })
  return msg.reactions.removeAll().catch(() => {})
}

module.exports = class UserInfo extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'userinfo',
      category: 'utility',
      aliases: ['ui', 'uinfo', 'useri'],
      utils: {
        parameters: [
          {
            type: 'user',
            fetchAll: true,
            required: false,
            acceptSelf: true,
            missingError: 'errors:invalidUser'
          }
        ]
      }
    })
  }

  async run ({ channel, t, author, message, guild }, user = author) {
    const embed = new MessageEmbed(author)
    const language = this.client.database.guilds.get(message.guild.id).language

    let Status
    if (user.presence.status === 'online') Status = Emojis.Online
    if (user.presence.status === 'dnd') Status = Emojis.Dnd
    if (user.presence.status === 'idle') Status = Emojis.Idle
    if (user.presence.status === 'offline') Status = Emojis.Offline
    if (user.presence.status === 'streaming') Status = Emojis.Streaming

    const URolesSize = channel.permissionsFor(user.id) ? Number(guild.member(user.id).roles.cache.size - 1) : 0

    channel
      .send(
        embed
        .setColor(Constants.EMBED_COLOR)
          .addField(t('commands:userinfo.name'), user.tag, true)
          .addField(
            t('commands:userinfo.nickname.ctx'),
            user.nickname
              ? user.nickname
              : t('commands:userinfo.nickname.none'),
            true
          )
          .addField(t('commands:userinfo.id'), user.id, false)
          .addField(
            t('commands:userinfo.createdAt'),
            await this.Time(user.createdAt, language),
            false
          )
          .addField(
            t('commands:userinfo.joinedAt.ctx'),
            channel.permissionsFor(user.id) ? await this.Time(guild.member(user.id).joinedAt, language) : t('commands:userinfo:joinedAt.NotInThisServer'),
            false
          )
          .addField(
            t('commands:userinfo.status.ctx'),
            Status + t(`commands:userinfo.status.${user.presence.status}`),
            true
          )
          .addField(
            t('commands:userinfo.bot.ctx'),
            user.bot ? Emojis.Bot + t(`commands:userinfo.bot.true`) : t(`commands:userinfo.bot.false`),
            true
          )
          .addField(
            t('commands:userinfo.role.ctx', {
              size: URolesSize
            }),
            channel.permissionsFor(user.id) ? await this.Roles(user, guild, t, language) : t('commands:userinfo:joinedAt.NotInThisServer'),
            false
          )
      )
      .then(msg => {
        if (!channel.permissionsFor(user.id)) return
        msg.react('▶️')
        return ((N = 0) => {
          const initializeCollector = msg.createReactionCollector(
            (reaction, user) =>
              (reaction.emoji.name === '◀️' || reaction.emoji.name === '▶️') &&
              user.id === author.id,
            { time: 120000 }
          )

          msgTimeOut(msg, 120000)
          return initializeCollector
            .on('collect', async r => {
              if (
                guild &&
                channel
                  .permissionsFor(this.client.user.id)
                  .has('MANAGE_MESSAGES')
              ) {
                await msg.reactions.removeAll()
              } else r.remove(this.client.user.id)

              // eslint-disable-next-line eqeqeq
              if (N == 0) {
                this.newEmbed(msg, user, author, channel, t).catch(() => {})
                msg.react('◀️')
              } else {
                msg.edit(embed).catch(() => {})
                msg.react('▶️')
              }

              // eslint-disable-next-line no-return-assign
              return N === 1 ? (N = 0) : (N = 1)
            })
            .catch(async () => {
              if (
                guild &&
                channel
                  .permissionsFor(this.client.user.id)
                  .has('MANAGE_MESSAGES')
              ) {
                await msg.reactions.removeAll()
              } else msg.user.reaction.remove(this.client.user.id)

              msg.edit(embed.setColor(process.env.ERROR_COLOR))
              return initializeCollector.stop()
            })
        })()
      })
      .catch(() => {})
  }

  Roles (user, guild, t, lang) {
    const ROLES = guild
      .member(user.id)
      .roles
      .cache.map(role => role)
      .slice(1)
    if (!ROLES.length) return t('commands:userinfo.role.none')
    return [
      ROLES.length > 10
        ? ROLES.map(r => r)
          .slice(0, 10)
          .join(', ') +
          ` ${t('commands:userinfo.role.and', {
            size: Number(ROLES.length - 10).localeNumber(lang)
          })}`
        : ROLES.map(r => r).join(', ')
    ]
  }

  newEmbed (
    msg,
    user,
    author,
    channel,
    t,
    { displayAvatarURL } = this.client.user
  ) {
    return msg.edit(
       new MessageEmbed(author)
        .setAuthor(this.client.user.username, displayAvatarURL)
        .setThumbnail(user.avatarURL ? user.avatarURL : displayAvatarURL)
        .setColor(Constants.EMBED_COLOR)
        .addField(
          t('commands:userinfo.permissions'),
          channel
            .permissionsFor(user.id)
            .toArray()
            .map(perm => `\`${perm}\``)
            .join(', ')
        )
    )
  }

  Time (ms, language) {
    moment.locale(language)
    return moment(ms).format('LLLL')
  }
}