const { Schema } = require('mongoose')

const CommandUtils = new Schema({
  ownerPermission: { type: Boolean, default: false },
  devPermission: { type: Boolean, default: false },
  vipUser: { type: Boolean, default: false }
})

const mannu = new Schema({ type: Boolean, default: false })
const uses = new Schema({ type: Number, default: 0 })

module.exports = new Schema({
    _id: String,
    utils: [CommandUtils],
    maintence: mannu,
    usages: uses
  })
