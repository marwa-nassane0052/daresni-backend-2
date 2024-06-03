const mongoose = require('mongoose');

const chatGroupSchema = new mongoose.Schema({
  nomdechatgroupe: { type: String},
  idsession: { type: String },
  messages:[{type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'}]
});

const ChatGroup = mongoose.model('ChatGroup', chatGroupSchema);

module.exports = ChatGroup;
