const Post = require('../models/posts');
const Comment = require('../models/comments');
const { getUser } = require('../utils/authUtils');
async function createComment(req, res) {
    try {
        const token = req.headers.authorization;
        if (!token) {
          return res.status(401).json({ error: "Authorization token is required" });
        }
  
        let authorData;
        try {
          authorData = await getUser(token);
          if (!authorData || !authorData._id) {
            return res.status(500).json({ error: "Invalid authentication data" });
          }
          console.log('Authenticated user data:', authorData);
        } catch (error) {
          console.error("Authentication error:", error);
          return res.status(500).json({ error: "Unable to verify authentication" });
        }
        const postId = req.params.postId;
        const commentData = req.body;
        const newComent = new Comment({
            content: commentData.content, 
            author_full_name: `${authorData.name} ${authorData.familyname}`, 
            author_email: authorData.email,
            post: postId,
            
          });
          await newComent.save();
        const post = await Post.findByIdAndUpdate(postId, { $push: { comments: newComent._id } }, { new: true });
        res.status(201).json(newComent);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Unable to create comment" });
    }
}
const getCommentsByPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }); 
        res.json(comments);
    } catch (error) {
        next(error);
    }
};




module.exports = { createComment, getCommentsByPost };
