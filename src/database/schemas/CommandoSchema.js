const { Schema } = require('mongoose')

const CommandUtils = ({
  ownerPermission: { type: Boolean, default: false },
  devPermission: { type: Boolean, default: false },
})

const mannu = ({ type: Boolean, default: false })
const uses = ({ type: Number, default: 0 })

module.exports = new Schema({
    _id: String,
    utils: [CommandUtils],
    maintence: mannu,
    usages: uses
  })
