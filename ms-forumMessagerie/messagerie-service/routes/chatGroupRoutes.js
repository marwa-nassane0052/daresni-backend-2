const express = require('express');
const router = express.Router();
const chatGroupController = require('../controllers/chatGroupController');

router.post('/chatgroups/:SessionId', chatGroupController.createChatGroup);
router.get('/chatgroups/:SessionId', chatGroupController.getChatGroups);

module.exports = router;
