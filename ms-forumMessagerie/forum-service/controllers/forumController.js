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
        console.log(error);
        res.status(500).json({ error: "Unable to create forum" });
    }


}


async function getForum(req, res){
    try{
 const SessionId=req.params.SessionId
 const forum=await Forum.find({sessionId:SessionId})
 res.status(200).json(forum)
    }
    catch (error) {
        res.status(500).json({ error: error.message });
}}

module.exports = { createForum,getForum };
