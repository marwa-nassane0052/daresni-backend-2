const Forum = require('../models/forum');


async function createForum(req, res) {
    try {
        // Get the session ID from the request parameters
        const SessionId = req.params.SessionId;

        // Get data from the request body

        // Create a new forum
        // Find the session by ID and push the new forum's ID into its forum array
        const newForum = new Forum({
            sessionId:SessionId
        })
        await newForum.save();
        // Respond with the newly created forum
        res.status(201).json(newForum);
    } catch (error) {
        // Handle errors
        console.error("Error creating forum:", error);
        res.status(500).json({ error: "Unable to create forum" });
    }
}

module.exports = { createForum };
