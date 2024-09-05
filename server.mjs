import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';


async function setupDatabase() {
    const adapter = new JSONFile('db.json');
    const db = new Low(adapter, { users: [], messages: [] });

    
    await db.read();

    
    db.data ||= { users: [], messages: [] };
    
    await db.write();

    return db;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', async (socket) => {
    console.log('a user connected');

    
    const db = await setupDatabase();

    socket.on('set username', async (username) => {
        socket.username = username;

        
        db.data.users.push(username);
        await db.write();

        io.emit('user connected', db.data.users);
    });

    socket.on('chat message', async (msg) => {
        const messageData = { user: socket.username, message: msg };
        db.data.messages.push(messageData);
        await db.write();

        io.emit('chat message', messageData);
    });

    socket.on('disconnect', async () => {
        console.log('user disconnected');

        
        db.data.users = db.data.users.filter(user => user !== socket.username);
        await db.write();

        io.emit('user disconnected', db.data.users);
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('listening on *:3000');
});

