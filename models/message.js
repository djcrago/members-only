const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true, minLength: 1 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

MessageSchema.virtual('url').get(function () {
  return `/messages/${this._id}`;
});

module.exports = mongoose.model('Message', MessageSchema);
