const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  text:{
    type: String,
    required: true
  },
  author_full_name: {
    type: String,
    
  },
  author_email: {
    type: String,
    
  },
  
  forumId: {
    type: String,
    ref: 'Forum',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
