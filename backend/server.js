// server.js

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from './config/passport.js';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import patientRoutes from './routes/patients.routes.js';
import doctorRoutes from './routes/doctors.routes.js';
import institutionRoutes from './routes/institutions.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import messageRoutes from './routes/messages.routes.js';

// Módulos para criar servidor HTTP e usar Socket.IO
import http from 'http';
import { Server as SocketServer } from 'socket.io';

// Inicializa o Express
const app = express();

// Carrega as variáveis do arquivo .env para process.env
dotenv.config();

// Middleware CORS: permite que o frontend (localhost:5173) acesse o backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middlewares para interpretar JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/image', express.static(path.join(process.cwd(), 'image')));

// Middleware de sessão (necessário para login com Passport)
app.use(session({
  secret: process.env.SECRET_SESSION, // Substitua por uma chave segura em produção
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Inicializa autenticação com Passport
app.use(passport.initialize());
app.use(passport.session());

// --------------------------------------------------
// Servidor HTTP + Socket.IO para chat em tempo real
// --------------------------------------------------
const server = http.createServer(app); // Cria o servidor HTTP a partir do Express
const io = new SocketServer(server, {
  cors: {
    origin: ['http://localhost:5173' || 'https://projeto-multidisciplinar-frontend.vercel.app'], // Libera acesso para o frontend
    credentials: true
  }
});

// Armazena usuários online por socket ID
const onlineUsers = {};

io.on('connection', (socket) => {
  // Entrar em uma sala
  socket.on('join_room', ({ room, user }) => {
    socket.join(room);
    onlineUsers[socket.id] = { room, user };
    console.log(`Usuário ${user.name} entrou na sala ${room}`);

    // Notifica outros usuários da sala
    socket.to(room).emit('user_joined', { user });
  });

  // Recebe e repassa mensagem para todos da sala
  socket.on('send_message', ({ room, message, user }) => {
    io.to(room).emit('receive_message', {
      user,
      message,
      timestamp: new Date()
    });
  });

  // Ao desconectar
  socket.on('disconnect', () => {
    const userData = onlineUsers[socket.id];
    if (userData) {
      socket.to(userData.room).emit('user_left', { user: userData.user });
      delete onlineUsers[socket.id];
      console.log(`Usuário saiu da sala ${userData.room}`);
    }
  });

  // Oferta
  socket.on("offer", ({ offer, room, sender, target }) => {
    io.to(target).emit("offer", { offer, sender });
  });

  // Resposta
  socket.on("answer", ({ answer, room, sender, target }) => {
    io.to(target).emit("answer", { answer, sender });
  });

  // ICE Candidate
  socket.on("ice_candidate", ({ candidate, room, sender, target }) => {
    io.to(target).emit("ice_candidate", { candidate, sender });
  });
});

// Rotas da aplicação
app.use(authRoutes);
app.use(userRoutes);
app.use(patientRoutes);
app.use(doctorRoutes);
app.use(institutionRoutes);
app.use(appointmentRoutes);
app.use(messageRoutes);

// ------------------------
// Inicializa o servidor
// ------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app; // Para testes e reuso
