const MongoRepository = require('../MongoRepository.js')
const model = require('../schemas/UserSchema')

module.exports = class UserRepository extends MongoRepository {
  constructor (mongoose) {
    super(mongoose, mongoose.model('users', model))
  }

  parse (entity) {
    return {
      blacklisted: false,
      ...(super.parse(entity) || {})
    }
  }
}