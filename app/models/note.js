const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  createdAt: {type: Date, default: Date.now()},
  updateAt: {type: Date, default: Date.now()},
  auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
})

noteSchema.index({'title': 'text', 'body': 'text'})

module.exports = mongoose.model('Note', noteSchema)