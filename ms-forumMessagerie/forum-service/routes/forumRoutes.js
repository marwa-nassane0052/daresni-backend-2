const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
// Route for creating a new forum
router.post('/createforum/:SessionId', forumController.createForum);
router.get('/getForum/:SessionId', forumController.getForum);
module.exports = router;

