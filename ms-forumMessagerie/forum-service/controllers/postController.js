const Post = require('../models/posts');
const Forum = require('../models/forum');
const multer = require('multer');
const { mkdirSync, existsSync } = require('fs');
const { getUser } = require('../utils/authUtils');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/";
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Set up multer upload middleware for single file uploads
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
}).single("content");

async function createPost(req, res) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        return res.status(400).json({ error: "File upload error: " + err.message });
      } else if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ error: "Error uploading file" });
      }

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
      const forumId = req.params.forumId;
      const postData = req.body;
      let content;

      if (req.file) {
        content = req.file.filename;
      } else {
        content = postData.content;
      }

      const newPost = new Post({
        title: postData.title,
        content: content,
        text:postData.text,
        author_full_name: `${authorData.name} ${authorData.familyname}`, 
        author_email: authorData.email,
        forumId: forumId
      });

      await newPost.save();
      console.log('Post saved:', newPost); 

      await Forum.findByIdAndUpdate(
        forumId,
        { $push: { posts: newPost._id } },
        { new: true }
      );

      res.status(201).json(newPost);
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Unable to create post" });
  }
}

async function getAllPosts(req, res) {
  try {
    const forumId = req.params.forumId;
    const baseUrl = req.protocol + '://' + req.get('host') + '/uploads/'; // Adjust the base URL according to your setup

    const posts = await Post.find({ forumId });
    const updatedPosts = posts.map(post => {
      if (post.content) {
        post.content = baseUrl + post.content;
      }
      return post;
    });

    res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Unable to fetch posts" });
  }
}

module.exports = {
  createPost,
  getAllPosts
};
