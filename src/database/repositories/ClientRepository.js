const MongoRepository = require('../MongoRepository')
const model = require('../schemas/ClientSchema')
module.exports = class ClientRepository extends MongoRepository {
  constructor (mongoose) {
    super(mongoose, mongoose.model('clients', model))
  }

  parse (entity) {
    return {
      maintence: false,
      ...(super.parse(entity) || {})
    }
  }
}