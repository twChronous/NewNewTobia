const MongoRepository = require('../MongoRepository')
const model = require('../schemas/CommandoSchema')
module.exports = class ComandoRepository extends MongoRepository {
  constructor (mongoose) {
    super(mongoose, mongoose.model('commands', model))
  }

  parse (entity) {
    return {
      maintence: false,
      usages: 0,
      ...(super.parse(entity) || {})
    }
  }
}