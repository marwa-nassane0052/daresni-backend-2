const express = require('express');
const router = express.Router();
const chatGroupController = require('../controllers/chatGroupController');

router.post('/:SessionId/chatgroups', chatGroupController.createChatGroup);
router.get('/:SessionId/chatgroups', chatGroupController.getChatGroups);

module.exports = router;
