// Importações principais
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import env from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurações iniciais
const app = express();
const server = http.createServer(app); // Servidor HTTP para usar com Socket.IO
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

const port = 3000;
const saltRounds = 10;
env.config();

// Banco de dados
const db = new pg.Client({
  user: process.env.PG_USER,
  database: process.env.PG_DB,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect()
  .then(() => console.log("Banco de dados conectado"))
  .catch((err) => console.error("Erro no banco:", err));

// Multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'institution';
    if (req.originalUrl.includes("/doctor")) folder = 'doctor';
    const imageDir = `image/${folder}`;
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/image', express.static(path.join(process.cwd(), 'image')));

// Sessão
app.use(session({
  secret: "SESSION_SECRET",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000, httpOnly: true }
}));

app.use(passport.initialize());
app.use(passport.session());

const onlineUsers = {};
const rooms = {}; // Armazena sockets de cada sala

io.on('connection', (socket) => {
    console.log('Novo usuário conectado:', socket.id);

    /**
     * Quando um usuário entra na sala
     */
    socket.on('join_room', ({ room, user }) => {
        socket.join(room);
        onlineUsers[socket.id] = { room, user };

        if (!rooms[room]) {
            rooms[room] = [];
        }
        rooms[room].push(socket.id);

        console.log(`Usuário ${user.name} entrou na sala ${room}`);

        // Envia para o usuário atual quem já está na sala
        const otherUsers = rooms[room].filter(id => id !== socket.id);
        socket.emit('other_users', otherUsers);

        // Notifica outros usuários na sala que alguém entrou
        socket.to(room).emit('user_joined', { user });
    });

    /**
     * Envio de mensagens de texto
     */
    socket.on('send_message', (data) => {
        const { room, message, user } = data;
        io.to(room).emit('receive_message', {
            user,
            message,
            timestamp: new Date()
        });
    });

    /**
     * WebRTC Signaling - Oferta
     */
    socket.on('offer', ({ room, offer, sender }) => {
        socket.to(room).emit('offer', { offer, sender });
    });

    /**
     * WebRTC Signaling - Resposta
     */
    socket.on('answer', ({ room, answer, sender }) => {
        socket.to(room).emit('answer', { answer, sender });
    });

    /**
     * ICE Candidates
     */
    socket.on('ice_candidate', ({ room, candidate, sender }) => {
        socket.to(room).emit('ice_candidate', { candidate, sender });
    });

    /**
     * Desconectar
     */
    socket.on('disconnect', () => {
        const userData = onlineUsers[socket.id];
        if (userData) {
            const { room, user } = userData;

            // Remove socket da sala
            rooms[room] = rooms[room].filter(id => id !== socket.id);
            if (rooms[room].length === 0) {
                delete rooms[room]; // Limpa sala vazia
            }

            socket.to(room).emit('user_left', { user });
            delete onlineUsers[socket.id];

            console.log(`Usuário ${user.name} saiu da sala ${room}`);
        }
    });
});

// Rota protegida - retorna dados do usuário logado
app.get("/user", (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "Usuário não autenticado" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Erro ao sair" });
    res.status(200).json({ message: "Logout realizado com sucesso" });
  });
});

// Retorna todos os pacientes
app.get("/patients", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT users.id, users.name, users.email, patients.birth_date, patients.phone, patients.gender
      FROM users
      INNER JOIN patients
      ON users.id = patients.user_id  
    `);
    const patients = result.rows;
    return res.status(200).json({ message: "Pacientes encontrados ", patients});
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar pacientes:", error });
  }
});

// Informações adicionais do paciente
app.get("/patient/:id", async (req, res) => {
  const user_id = req.params.id;

  try {
    const result = await db.query("SELECT * FROM patients WHERE user_id = $1", [user_id]);
    const patient = result.rows[0];

    if (!patient) return res.status(401).json({ message: "Informações do paciente não foram cadastradas" });

    return res.status(200).json({ message: "Paciente já cadastrou suas informações", patient });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar paciente:", error });
  }
});

// Informações adicionais do médico
app.get("/doctor/:id", async (req, res) => {
  const user_id = req.params.id;

  try {
    const result = await db.query(`
      SELECT 
        doctors.cpf,
        doctors.phone,
        doctors.gender,
        doctors.specialty, 
        institutions.name AS institution_name
      FROM doctors
      INNER JOIN institutions ON doctors.institution_id = institutions.id
      WHERE user_id = $1
      `,
      [user_id]
    );
    const doctor = result.rows[0];

    if (!doctor) return res.status(401).json({ message: "Médico não encontrado" });

    return res.status(200).json({ message: "Médico encontrado", doctor });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar médico:", error });
  }
});

// Retorna todas as instituições
app.get("/institutions", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM institutions ORDER BY name ASC");
    const institutions = result.rows;
    return res.status(200).json({ message: "Instituições encontradas ", institutions });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar as instituições:", error });
  }
});

// Retorna todos os médicos
app.get("/doctors", async (req, res) => {
  try {
    const response = await db.query(`
      SELECT 
        users.name AS user_name, 
        users.email AS user_email,
        doctors.id,
        doctors.phone AS doctor_phone, 
        doctors.specialty,
        doctors.institution_id,
        doctors.image_path,
        doctors.available_days,
        doctors.schedule,
        institutions.name AS institution_name
      FROM users
      INNER JOIN doctors ON users.id = doctors.user_id
      INNER JOIN institutions ON doctors.institution_id = institutions.id 
    `);

    return res.status(200).json({ message: "Médicos enconstrados", doctors: response.rows});
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar os médicos:", error });
  }
});

// Buscar horários ocupados de um médico em uma data específica
app.get("/appointments/occupied/:id", async (req, res) => {
    const doctor_id = req.params.id;

    try {
        const result = await db.query(
            `SELECT appointment_time, appointment_date
            FROM appointments
            WHERE doctor_id = $1 
            AND status != 'cancelada'`, // Exclui os cancelados e concluídos
            [doctor_id]
        );

        const occupiedTimes = result.rows;

        return res.status(200).json({ occupiedTimes });
    } catch (error) {
        console.error("Erro ao buscar horários ocupados:", error);
        return res.status(500).json({
            message: "Erro no servidor ao buscar horários ocupados"
        });
    }
});

// Buscar agendamentos de um usuário (paciente ou médico)
app.get("/appointments/user/:id", async (req, res) => {
    const user_id = req.params.id; // ID do usuário (paciente ou médico)

    try {
        // Faz a consulta no banco buscando os agendamentos
        const result = await db.query(
            `SELECT 
                appointments.id,
                appointments.appointment_date,
                appointments.appointment_time,
                appointments.status,
                patient_users.name AS patient_name,
                doctor_users.name AS doctor_name,
                institutions.name AS institution_name
            FROM appointments
            INNER JOIN patients ON appointments.patient_id = patients.id
            INNER JOIN users AS patient_users ON patients.user_id = patient_users.id
            INNER JOIN doctors ON appointments.doctor_id = doctors.id
            INNER JOIN users AS doctor_users ON doctors.user_id = doctor_users.id
            INNER JOIN institutions ON appointments.institution_id = institutions.id
            WHERE (patients.user_id = $1 OR doctors.user_id = $1)
            ORDER BY 
                CASE 
                    WHEN appointments.status = 'disponivel' THEN 1
                    WHEN appointments.status = 'agendada' THEN 2
                    WHEN appointments.status = 'concluida' THEN 3
                    WHEN appointments.status = 'cancelada' THEN 4
                    ELSE 5
                END,
                appointments.appointment_date ASC,
                appointments.appointment_time ASC;`,
            [user_id] // parâmetro para evitar SQL Injection
        );

        // Retorna os dados encontrados
        return res.status(200).json({ appointments: result.rows });
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return res.status(500).json({
            message: "Erro no servidor ao buscar agendamentos"
        });
    }
});

// Consultar se o usuário está permitido a acessar a consulta
app.get('/appointments/:appointmentId/validate-user/:userId', async (req, res) => {
    const { appointmentId, userId } = req.params;

    try {
        const result = await db.query(
            `
            SELECT *
            FROM appointments
            WHERE id = $1
            AND (
                patient_id = (SELECT id FROM patients WHERE user_id = $2)
                OR doctor_id = (SELECT id FROM doctors WHERE user_id = $2)
            )
            `,
            [appointmentId, userId]
        );

        if (result.rows.length > 0) {
            res.json({ valid: true });
        } else {
            res.status(403).json({ valid: false, message: 'Acesso negado a esta consulta' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Buscar mensagens de uma consulta
app.get("/messages/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT m.id, m.message, m.timestamp, u.id AS user_id, u.name AS user_name
      FROM messages AS m
      JOIN users u ON u.id = m.user_id
      WHERE m.appointment_id = $1
      ORDER BY m.timestamp ASC`,
      [appointmentId]
    );

    const formattedMessages = rows.map(row => ({
      id: row.id,
      message: row.message,
      createdAt: row.created_at,
      user: {
        id: row.user_id,
        name: row.user_name
      }
    }));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ message: "Erro ao buscar mensagens", error });
  }
});


// Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    if (!user) return res.status(401).json({ message: info.message });

    // Cria a sessão
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: "Erro ao criar sessão" });
      return res.status(200).json({ message: "Login bem-sucedido", user });
    });
  })(req, res, next);
});

// Registro de novo usuário
app.post("/register-user", async (req, res) => {
  const { name, email, cpf, password, termsAccepted } = req.body;

  let type = 'patient'; // Valor padrão

  if (req.body.type === 'doctor') {
    type = 'doctor';
  }
 
  try {
    // Verificar se o email já está cadastrado em users ou institutions
    const checkEmail = await db.query(`
      SELECT 1 FROM users WHERE email = $1
      UNION
      SELECT 1 FROM institutions WHERE email = $1
    `, [email]);    

    if (checkEmail.rows[0]) return res.status(409).json({ message: "Email já registrado" });

    // Verificar se o CPF já foi cadastrado
    const checkCPF = await db.query("SELECT * FROM patients WHERE cpf = $1",
      [cpf]
    );

    if (checkCPF.rows[0]) return res.status(409).json({ message: "CPF já registrado" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUserResult = await db.query(
      "INSERT INTO users (name, email, password, type, accepted_terms) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, hashedPassword, type, termsAccepted]
    );

    const newUser = newUserResult.rows[0];

    // Caso o usuário seja do tipo 'doctor', impede que tente criar uma sessão após o cadastro
    if (newUser.type === 'doctor') return res.status(201).json({ message: "Usuário registrado com sucesso", user: newUser });

    // Cria sessão imediatamente após o cadastro
    req.logIn(newUser, (err) => {
      if (err) return res.status(500).json({ message: "Erro ao criar sessão após cadastro" });
      return res.status(201).json({ message: "Usuário registrado e autenticado", user: newUser });
    });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro no servidor ao registrar usuário" });
  }
});

// Informações do paciente
app.post("/patient", async (req, res) => {
  const {user_id, cpf, phone, gender, birth_date} = req.body;

  console.log(req.body)

  try {
    await db.query("INSERT INTO patients (user_id, cpf, phone, gender, birth_date) VALUES ($1, $2, $3, $4, $5)",
      [user_id, cpf, phone, gender, birth_date]
    );
    return res.status(201).json({ message: "Informações cadastradas com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor ao adicionar informações" });
  }
});

// Registro de instituição
app.post("/institution", upload.single('image'), async (req, res) => {
  const { name, cnpj, email, phone, address, city, state, zip_code } = req.body;
  const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null; // Caminho da imagem salva

  console.log(imagePath)

  try {
    // Verificar se o email já está cadastrado em users ou institutions
    const checkEmail = await db.query(`
      SELECT 1 FROM users WHERE email = $1
      UNION
      SELECT 1 FROM institutions WHERE email = $1
    `, [email]);

    if (checkEmail.rows[0]) {
      if (req.file) fs.unlinkSync(req.file.path); // remove a imagem salva
      return res.status(401).json({ message: "Email já cadastrado" });
    };

    // Verificar se o cnpj já está cadastrado
    const checkCNPJ = await db.query("SELECT 1 FROM institutions WHERE cnpj = $1", [cnpj]);

    if (checkCNPJ.rows[0]) {
      if (req.file) fs.unlinkSync(req.file.path); // remove a imagem salva
      return res.status(401).json({ message: "CNPJ já cadastrado" });
    };

    // Inserir instituição no banco de dados
    await db.query(
      `INSERT INTO institutions (name, cnpj, email, phone, address, city, state, zip_code, image_path)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [name, cnpj, email, phone, address, city, state, zip_code, imagePath]
    );

    res.status(201).json({ message: "Instituição registrada com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar instituição:", error);
    return res.status(500).json({ message: "Erro no servidor", error });
  }
});

// Resgistro de médico
app.post("/doctor", upload.single('image'), async (req, res) => {
  try {
    // Extração segura dos dados do corpo (todos são string quando vêm do multipart/form-data)
    const {
      cpf,
      phone,
      birth,
      gender,
      institution,
      specialty,
      availableDays,
      schedule,
      user_id,
    } = req.body;

    const image_path = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // Transforma availableDays (string JSON) em array para PostgreSQL
    const parsedAvailableDays = JSON.parse(availableDays); // array de strings

    // Transforma schedule (string JSON) em objeto JSON válido
    const parsedSchedule = JSON.parse(schedule); // objeto com dias, horários, etc.

    // Insere no banco
    await db.query(
      `INSERT INTO doctors 
        (cpf, phone, birth, gender, institution_id, specialty, available_days, schedule, image_path, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        cpf,
        phone,
        birth,
        gender,
        parseInt(institution), // cuidado: isso vem como string do req.body
        specialty,
        parsedAvailableDays,   // array
        parsedSchedule,        // jsonb
        image_path,
        parseInt(user_id)
      ]
    );

    res.status(201).json({ message: "Médico registrado com sucesso" });

  } catch (error) {
    console.error("Erro ao registrar médico:", error);
    res.status(500).json({ message: "Erro no servidor", error });
  }
});

// Agendar uma consulta
app.post("/appointments", async (req, res) => {
  const { patient_id, doctor_id, institution_id, date, time } = req.body;

  try {
    await db.query(
      "INSERT INTO appointments (patient_id, doctor_id, institution_id, appointment_date, appointment_time, status) VALUES ($1, $2, $3, $4, $5, $6)",
      [patient_id, doctor_id, institution_id, date, time, 'agendada']
    );

    return res.status(201).json({ message: "Consulta agendada com sucesso" });
  } catch (error) {
    console.error('Erro ao agendar consulta:', error);
    return res.status(500).json({ message: "Erro no servidor ao agendar consulta" });
  }
});

// Salvar as mensagens do chat da consulta
app.post("/message", async (req, res) => {
  const { appointmentId, userId, message } = req.body;

  try {
    await db.query(
      `INSERT INTO messages (appointment_id, user_id, message)
      VALUES ($1, $2, $3)`, 
    [appointmentId, userId, message]);

    res.status(200).json({ message: "Mensagem salva com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor ", error });
  }
});

// Atualizar o status
app.patch("/appointment/update-status/:id", async (req, res) => {
  const appointment_id = req.params.id;
  const appointment_status = req.body.status;
  
  try {
    await db.query(`
      UPDATE appointments
      SET status=$1
      WHERE id=$2
    `, [appointment_status, appointment_id]);

    res.status(200).json({ message: "Status alterado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
});

// Requisição para deletar médico (e sua imagem)
app.delete("/doctor/:id", async (req, res) => {
  const doctor_id = req.params.id;

  try {
    // Busca o caminho da imagem do médico
    const result = await db.query(
      `SELECT doctors.image_path FROM doctors WHERE user_id = $1`,
      [doctor_id]
    );

    const imagePath = result.rows[0]?.image_path;

    // Deleta a imagem se existir
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Deleta o usuário (médico)
    await db.query("DELETE FROM users WHERE id = $1", [doctor_id]);

    return res.status(200).json({ message: "Médico deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar médico:", error);
    res.status(500).json({ message: "Erro no servidor ao deletar médico" });
  }
});

// Requisição para deletar instituição (e sua imagem)
app.delete("/institution/:id", async (req, res) => {
  const inst_id = req.params.id;

  try {
    // Busca o caminho da imagem da instituição
    const result = await db.query(
      `SELECT image_path FROM institutions WHERE id = $1`,
      [inst_id]
    );

    const imagePath = result.rows[0]?.image_path;

    // Deleta a imagem se existir
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Deleta a instituição
    await db.query("DELETE FROM institutions WHERE id = $1", [inst_id]);

    return res.status(200).json({ message: "Instituição deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar instituição:", error);
    res.status(500).json({ message: "Erro no servidor ao deletar instituição" });
  }
});

// Estratégia de autenticação local
passport.use("local",
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];

      if (!user) return done(null, false, { message: "Email ou senha incorretos" });

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return done(null, false, { message: "Email ou senha incorretos" });

      return done(null, user);
    } catch (err) {
      console.error("Erro na autenticação:", err);
      return done(err);
    }
  })
);

// Serializa o usuário para manter na sessão
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Desserializa a sessão e recupera o usuário
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Inicializa o servidor
server.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
