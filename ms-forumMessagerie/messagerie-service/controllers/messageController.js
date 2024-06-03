const ChatGroup = require('../models/ChatGroup');
const Message = require('../models/Message');
const { getUser } = require('../utils/authUtils');
exports.createMessage = async (req, res) => {
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
    const { chatGroupId } = req.params;
    const { contenu } = req.body;
    const message = new Message({ 
      contenu,
       nomuser: `${authorData.name} ${authorData.familyname}`, 
       chatGroupId });
    await message.save();
    await ChatGroup.findByIdAndUpdate(
      chatGroupId,
      { $push: { messages: message._id } },
      { new: true }
    );

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessagesByChatGroup = async (req, res) => {
  try {
    const messages = await Message.find({ chatGroupId: req.params.chatGroupId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

