const io = require('socket.io-client');
const socket = io('http://localhost:3002'); // Replace with your server URL and port if different

// Simulate joining a chat group
socket.emit('joinRoom', { chatGroupId: 'testChatGroupId' });

// Listen for connection confirmation
socket.on('connect', () => {
  console.log('Connected to the server');

  // Send a test message
  socket.emit('sendMessage', {
    chatGroupId: '664b23273af62fdc39f1fc31',
    contenu: 'hi',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGVzaS1zYmEuZHoiLCJpZCI6IjY2NGE4MjdiNTc0YjVjNmQ3NzdlODQ2OCIsImlhdCI6MTcxNjIxNzIyOSwiZXhwIjoxNzE2MzAzNjI5fQ.VO3wdyPC1f8QC69_JtnTXrZCPcFIR9UIG1tzxAyGPcY'
  });
});

// Listen for the new message event
socket.on('newMessage', (message) => {
  console.log('New message received:', message);
});

// Listen for error messages
socket.on('errorMessage', (error) => {
  console.error('Error message received:', error);
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
