const ChatGroup = require('../models/ChatGroup');

async function createChatGroup(req, res){
  try {
     // Get the session ID from the request parameters
    const idsession = req.params.SessionId;
    const nomdechatgroupe="Groupechat";
    const chatGroup = new ChatGroup({
        nomdechatgroupe: nomdechatgroupe,
        idsession: idsession
    });
    await chatGroup.save();
    res.status(201).json(chatGroup);
  } catch (error) {
    console.error('Error creating chat group:', error);
    res.status(400).json({ error: error.message });
  }
};

async function getChatGroups(req, res){
  try {
    const idsession = req.params.SessionId;
    const chatGroup = await ChatGroup.findOne({ idsession });
    res.status(200).json(chatGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { createChatGroup , getChatGroups};
