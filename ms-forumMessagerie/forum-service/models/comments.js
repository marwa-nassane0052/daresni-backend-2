const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author_full_name: {
    type: String,
    
  },
  author_email: {
    type: String,
    
  },
  post: {
    type: String,
    ref: 'Post', // Référence à la publication à laquelle le commentaire est associé
  
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
