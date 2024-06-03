const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Route for creating a new comment for a post
router.post('/createcomments/:postId', commentController.createComment);
// Route pour récupérer tous les commentaires d'une publication
router.get('/getcomments/:postId', commentController.getCommentsByPost);

module.exports = router;
