const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Message = require('./messagerie-service/models/Message');
const messageController = require('./messagerie-service/controllers/messageController');
const eurekaHelper = require('./eureka-helper');
const { Eureka } = require('eureka-js-client');
const path = require('path'); // Import the path module

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins. You can specify specific origins if needed.
    methods: ['GET', 'POST']
  }
});

// Configure MongoDB connection
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb+srv://mnassane:123456789Marwa@cluster0.9hn0nt1.mongodb.net/ms-forume?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// const client = new Eureka({
//   instance: {
//     app: 'ms-forumMessagerie',
//     hostName: 'localhost',
//     ipAddr: '127.0.0.1',
//     port: {
//       '$': 3002,
//       '@enabled': 'true',
//     },
//     vipAddress: 'ms-forumMessagerie',
//     dataCenterInfo: {
//       '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
//       name: 'MyOwn',
//     },
//   },
//   eureka: {
//     host: 'localhost',
//     port: 8888,
//     servicePath: '/eureka/apps/',
//   },
// });

// // Start Eureka client
// client.start((error) => {
//   if (error) {
//     console.error('Error starting Eureka client:', error);
//   } else {
//     console.log('Eureka client started successfully');
//   }
// });

// Import and use route modules 
// forum
const postRoutes = require('./forum-service/routes/postRoutes');
const commentRoutes = require('./forum-service/routes/commentRoutes');
const forumRoutes = require('./forum-service/routes/forumRoutes');
// messagerie
const chatGroupRoutes = require('./messagerie-service/routes/chatGroupRoutes');
const messageRoutes = require('./messagerie-service/routes/messageRoutes');
app.use('/forum', postRoutes);
app.use('/forum', commentRoutes);
app.use('/forum', forumRoutes);
app.use('/messagerie', chatGroupRoutes);
app.use('/messagerie', messageRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ chatGroupId }) => {
    socket.join(chatGroupId);
  });

  socket.on('leaveRoom', ({ chatGroupId }) => {
    socket.leave(chatGroupId);
  });

  socket.on('sendMessage', async (data) => {
    try {
      // Construct a mock req and res object
      const mockReq = {
        body: { contenu: data.contenu },
        params: { chatGroupId: data.chatGroupId },
        headers: { authorization: data.token }
      };
      const mockRes = {
        status: (statusCode) => ({
          json: (jsonResponse) => {
            if (statusCode === 201) {
              io.to(data.chatGroupId).emit('newMessage', jsonResponse);
            } else {
              socket.emit('errorMessage', jsonResponse);
            }
          }
        })
      };

      // Call the controller to create the message
      await messageController.createMessage(mockReq, mockRes);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
 });


 // Start the server
const PORT = process.env.PORT || 3030;
//eurekaHelper.registerWithEureka('ms-forumMessagerie', PORT);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
