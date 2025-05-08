const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  country: String,
  emailVerified: { type: Boolean, default: false },
  verificationCode:{ type: String, required:false},
  codeExpiresAt: {type:Date, required:false},
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
