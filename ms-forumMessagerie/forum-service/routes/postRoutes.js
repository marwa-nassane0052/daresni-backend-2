const express = require('express');
const { createPost, getAllPosts } = require('../controllers/postController');


const router = express.Router();

router.post('/:forumId/posts', createPost);
router.get('/:forumId/posts', getAllPosts);

module.exports = router;
