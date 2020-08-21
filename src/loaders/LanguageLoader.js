/* eslint-disable no-undef */
const i18next = require('i18next')
const translationBackend = require('i18next-node-fs-backend')
const { readdirSync } = require('fs')
const constants = require('../utils/Constants')

module.exports = class LanguageLoader {
    constructor(client) {
      this.client = client;
      this.language = { i18next, rootDir: constants.DEFAULT_LANGUAGE, langs: [], files: [] }
    }
    async start() {
        this.client.language = await this.loadLanguage();
        this.client.log(false, 'As Linguagens foram carregadas com exito.','[LanguageLoader]')
      }
    
      async loadLanguage (dirPath = 'src/locales') {
        this.language.files.push(
          ...readdirSync(`${dirPath}/${this.language.rootDir}`)
        )
        return i18next
          .use(translationBackend)
          .init({
            ns: [
              'commands',
              'errors',
              'permissions',
              'commons',
              'categories',
              'regions',
              'client'
            ],
            preload: await readdirSync(dirPath),
            fallbackLng: this.language.rootDir,
            backend: {
              loadPath: `${dirPath}/{{lng}}/{{ns}}.json`
            },
            interpolation: {
              escapeValue: false
            },
            returnEmptyString: false
          })
          .then(() => this.setLangCodes(Object.keys(i18next.store.data)))
      }
    
      setLangCodes (langs) {
        const push = name => {
          const aliases = [name.toLowerCase().trim()]
          if (name.includes('-')) {
            aliases.push(
              name
                .replace(/-/g, '')
                .toLowerCase()
                .trim()
            )
          }
    
          return this.language.langs.push({
            name: t =>
              typeof t === 'function' ? t(`regions:replaces.${name}`) : name,
            type: name.toLowerCase().trim(),
            id: name.trim(),
            aliases
          })
        }
    
        langs.forEach(async lang => {
          const requireFiles = this.language.files
          const path = await readdirSync(`src/locales/${lang}`)
    
          let trueFiles = 0
          if (path.length === requireFiles.length) {
            for (let i = 0; i < path.length; i++) { if (path[i] === requireFiles[i]) ++trueFiles }
            if (trueFiles === requireFiles.length) push(lang)
          }
        })
    
        return this.language
      }
}