const commandStructures = require('./structures/command')

module.exports = {
  // Structures
  Command: commandStructures.Command,
  CommandContext: commandStructures.CommandContext,
  ErrorCommand: commandStructures.ErrorCommand,
  Wrapper: require('./structures/Wrapper.js'),
  // Utils
  FileUtils: require('./utils/FileUtils'),
  Status: require('./utils/json/Status.json'),
  TobiasEmbed: require('./structures/TobiasEmbed'),
  Constants: require('./utils/Constants'),
  Emojis: require('./utils/Emojis'),
  Utils: require('./utils/Utils')
}