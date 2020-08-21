const { Schema } = require('mongoose')

const manu = new Schema({ type: Boolean, default: false })
const votes = new Schema({ Array })
const rvotes = new Schema({ Array })

module.exports =  new Schema({
    _id: String,
    maintence: manu,
    voteds: votes,
    removeVotes: rvotes
  })
