const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true, minLength: 1 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

MessageSchema.virtual('timestamp_formatted').get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model('Message', MessageSchema);
