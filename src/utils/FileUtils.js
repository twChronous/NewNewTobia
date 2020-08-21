/* eslint-disable no-undef */
const path = require('path')
const { promises } = require('fs');
const { readdir, lstat } = promises;

module.exports = requireDirectory = async (dirPath, call, error, recursive = true) => {
    const files = await readdir(dirPath)
    const filesObject = {}

    return Promise.all(
      files.map(async file => {
        const fullPath = path.resolve(dirPath, file)

        if (file.match(/\.(js|json)$/)) {
          try {
            const required = require(fullPath)
            filesObject[file] = required
            if (call) {
              call({ file: file.replace(/\.(js|json)$/, ''), required ,fullPath })
            }
            return required
          } catch (e) {
            if (typeof error === 'function') {
              return error(e, file.replace(/\.(js|json)$/, ''))
            }
            throw e
          }
        } else if (recursive) {
          const isDirectory = await lstat(fullPath).then(f =>
            f.isDirectory()
          )
          if (isDirectory) {
            return requireDirectory(fullPath, call, error)
          }
        }
      })
    ).then(() => filesObject)
  }
