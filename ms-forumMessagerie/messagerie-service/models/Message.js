const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  contenu: { type: String, required: true },
  nomuser: { type: String },
  chatGroupId: { type: String }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
