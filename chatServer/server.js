import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './configs/db.js';
import { userSocketMap, setIO } from './socketStore.js';
import chatRouter from './routes/chatRoutes.js';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect MongoDB
await connectDB();

// Middleware
app.use(express.json({ limit: '4mb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.status(200).send('Server is running...'));
app.use('/api/chat', chatRouter);

// SOCKET.IO
const ioInstance = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

setIO(ioInstance);

// Authenticate socket connection using Django JWT
ioInstance.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error: Token missing"));

    try {
        const decoded = jwt.verify(token, process.env.DJANGO_JWT_SECRET);
        socket.userId = decoded.user_id; // from Django JWT
        next();
    } catch (err) {
        next(new Error("Authentication error: Invalid token"));
    }
});

ioInstance.on('connection', (socket) => {
    const userId = socket.userId;
    if (!userId) return;

    console.log('User Connected:', userId);

    // Save socket
    userSocketMap[userId] = socket.id;

    // Broadcast online users
    ioInstance.emit('onlineUsers', Object.keys(userSocketMap));

    // Handle sending message
    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            ioInstance.to(receiverSocketId).emit('receiveMessage', { senderId, text, createdAt: new Date() });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User Disconnected:', userId);
        delete userSocketMap[userId];
        ioInstance.emit('onlineUsers', Object.keys(userSocketMap));
    });
});

server.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});

export default app;
