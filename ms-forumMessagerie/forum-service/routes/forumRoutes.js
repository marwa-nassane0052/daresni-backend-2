const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
// Route for creating a new forum
router.post('/createforum/:SessionId', forumController.createForum);
module.exports = router;

