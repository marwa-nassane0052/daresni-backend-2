const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/messages/:chatGroupId', messageController.createMessage);
router.get('/messages/:chatGroupId', messageController.getMessagesByChatGroup);

module.exports = router;
