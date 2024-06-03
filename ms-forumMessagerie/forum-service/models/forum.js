const mongoose = require('mongoose');
const forumSchema = new mongoose.Schema({

  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' // Référence aux commentaires de la publication
  }]
});

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;
