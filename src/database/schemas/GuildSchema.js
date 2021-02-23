const { Schema } = require('mongoose')

const Welcome = ({ id: String, message: String});
const Counter = ({ id: String, message: String});

module.exports =  new Schema({
    _id: String,
    prefix: String,
    language: String,
    welcomeMessage: [Welcome],
    memberCounter: [Counter]
  })
