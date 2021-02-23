const { Schema } = require('mongoose')

const BlacklistedSchema = ({
  reason: String,
  blacklister: { type: String, required: true }
})

module.exports = new Schema({
  _id: String,
  blacklisted: BlacklistedSchema,
})