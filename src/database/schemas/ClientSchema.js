const { Schema } = require('mongoose')

const manu = new Schema({ type: Boolean, default: false })

module.exports =  new Schema({
    _id: String,
    maintence: manu
  })
