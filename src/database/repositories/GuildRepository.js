const MongoRepository = require('../MongoRepository.js')
const Constants = require('../../utils/Constants.js')
const model = require('../schemas/GuildSchema')

module.exports = class GuildRepository extends MongoRepository {
  constructor (mongoose, ) {
    super(mongoose, mongoose.model('guilds', model))
  }

  parse (entity) {
    return {
      prefix: Constants.DEFAULT_PREFIX,
      language: Constants.DEFAULT_LANGUAGE,
      welcomeMessage: [],
      memberCounter: [],
      modules: new Map(),
      ...(super.parse(entity) || {})
    }
  }
}