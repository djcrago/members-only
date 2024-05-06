const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 1 },
  last_name: { type: String, required: true, minLength: 1 },
  username: { type: String, required: true, minLength: 4 },
  password: { type: String, required: true, minLength: 6 },
  member: { type: Boolean, required: true },
  admin: { type: Boolean },
});

UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`;
});

UserSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model('User', UserSchema);
