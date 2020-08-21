/* eslint-disable eqeqeq */
const { Command, Constants } = require('../..')
const { MessageEmbed } = require('discord.js');

const msgTimeOut = async (msg, time) => {
  await new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
  return msg.reactions.removeAll().catch(() => { })
}

module.exports = class Lyrics extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'lyrics',
      category: 'music',
      aliases: ['letra'],
      utils: {
        requirements: {
          guildOnly: true
        }
      }
    })
  }

  async run({ channel, author, t, args }) {
    const embed = new MessageEmbed(author)


    const search = args.join(' ')
    const AUTHOR = author.presence.activities
    
    function spotify(AUTHOR){
      try {
        if(AUTHOR[0].name === 'Spotify'){
          return true
        }
      } catch {
        return false
      }
    }
    const title = spotify(AUTHOR) ? AUTHOR[0].details : search.split('-')[0] 
    const artist = spotify(AUTHOR) ? AUTHOR[0].state.split(';')[0] : search.split('-')[1] 

    if(!title && !artist) {
      return channel.send(embed
        .setDescription(`❌ **${author.username}**, ${t('commands:lyrics:noSong')}`)
        .setColor(Constants.ERROR_COLOR)
      )
    }
    if (search || AUTHOR[0].name === 'Spotify') {
      const hit = await this.client.apis.geniusapi.loadLyrics(title, artist)
      const Art = await this.client.apis.geniusapi.loadArt(title, artist)

      if (hit) {
        let inPage = 0
        const body = await this.splitLyric(hit);

        (embed
          .setTitle(`${title} - ${artist}`)
          .setURL('https://genius.com')
          .setThumbnail(Art)
          .setDescription(body[0])
          .setColor(Constants.EMBED_COLOR)
          .setFooter(t('commands:lyrics.footer', {
            page: 1,
            total: body.length
          }), author.displayAvatarURL)
        )

        return channel.send(embed).then(async (msg) => {
          if (body.length > 1) {
            await msg.react('◀️')
            await msg.react('▶️')
            const initializeCollector = (msg.createReactionCollector(
              (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) &&
                user.id === author.id,
              { time: 120000 })
            )

            msgTimeOut(msg, 120000)
            return initializeCollector.on('collect', async (r) => {
              //await r.remove(author.id).catch(() => { })
              if (r.emoji.name == '▶️') {
                if ((inPage + 1) === body.length) {
                  inPage = 0
                  msg.edit(embed.setDescription(body[inPage]).setFooter(t('commands:lyrics.footer', {
                    page: (inPage + 1),
                    total: body.length
                  }), author.displayAvatarURL))
                } else {
                  inPage += 1
                  msg.edit(embed.setDescription(body[inPage]).setFooter(t('commands:lyrics.footer', {
                    page: (inPage + 1),
                    total: body.length
                  }), author.displayAvatarURL))
                }
              } else if (r.emoji.name == '◀️') {
                inPage !== 0 ? inPage -= 1 : inPage = body.length - 1
                msg.edit(embed.setDescription(body[inPage]).setFooter(t('commands:lyrics.footer', {
                  page: (inPage + 1),
                  total: body.length
                }), author.displayAvatarURL))
              }
            })
          }
        })
      } else {
        return channel.send(embed
          .setDescription(`:frowning: **${author.username}**, ${t('commands:lyrics:songNotFound')}`)
          .setColor(Constants.ERROR_COLOR)
        )
      }
    }
  }

  splitLyric(str) {
    return str.match(/(.|[\r\n]){1,500}/g)
  }
}