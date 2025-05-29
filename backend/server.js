// Importa os módulos necessários
import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import multer from 'multer';  // Para upload de imagem
import path from 'path';      // Para tratar caminhos de arquivo
import fs from 'fs';          // Para verificar/criar pastas

const app = express();  // Inicializa a aplicação Express
const port = 3000;  // Porta do backend
const saltRounds = 10;  // Fator de complexidade do bcrypt
env.config();  // Carrega variáveis de ambiente do .env

// Garante que a pasta de imagens existe
const imageDir = 'image/institution';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Configuração do Multer para salvar imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDir); // Pasta onde será salva a imagem
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Nome do arquivo salvo
  }
});

const upload = multer({ storage }); // Middleware para upload

// Conexão com PostgreSQL
const db = new pg.Client({
  user: process.env.PG_USER,
  database: process.env.PG_DB,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Conecta ao banco de dados
db.connect()
  .then(() => console.log("Conectado ao banco de dados."))
  .catch((error) => console.error("Erro ao conectar ao banco de dados:", error));

app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true // importante para sessões
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/image', express.static(path.join(process.cwd(), 'image')));

// Configuração da sessão
app.use(session({
  secret: "SESSION_SECRET", // Use uma chave secreta forte em produção
  resave: false,
  saveUninitialized: false, // Evita sessões vazias
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

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
    const result = await db.query("SELECT * FROM users WHERE type = 'patient' ORDER BY created_at DESC LIMIT 20");
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
  const { name, email, password, termsAccepted } = req.body;

  try {
    // Verificar se o email já está cadastrado em users ou institutions
    const checkEmail = await db.query(`
      SELECT 1 FROM users WHERE email = $1
      UNION
      SELECT 1 FROM institutions WHERE email = $1
    `, [email]);    

    if (checkEmail.rows[0]) return res.status(409).json({ message: "Email já registrado" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUserResult = await db.query(
      "INSERT INTO users (name, email, password, accepted_terms) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, termsAccepted]
    );

    const newUser = newUserResult.rows[0];

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

// Informações adicionais do paciente
app.post("/patient", async (req, res) => {
  const {user_id, cpf, phone, gender, birth_date} = req.body;

  try {
    const response = await db.query("INSERT INTO patients (user_id, cpf, phone, gender, birth_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, cpf, phone, gender, birth_date]
    );
    const patient = response.rows[0];
    return res.status(201).json({ message: "Informações cadastradas com sucesso", patient });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor ao adicionar informações" });
  }
})

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

    // Verificar se o cnpj já está cadastrado
    const checkCNPJ = await db.query("SELECT 1 FROM institutions WHERE cnpj = $1", [cnpj]);

    if (checkEmail.rows[0]) {
      if (req.file) fs.unlinkSync(req.file.path); // remove a imagem salva
      return res.status(401).json({ message: "Email já cadastrado" });
    };

    if (checkCNPJ.rows[0]) {
      if (req.file) fs.unlinkSync(req.file.path); // remove a imagem salva
      return res.status(401).json({ message: "CNPJ já cadastrado" });
    };

    // Inserir instituição no banco de dados
    await db.query(
      `INSERT INTO institutions (name, cnpj, email, phone, address, city, state, zip_code, image_path)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, cnpj, email, phone, address, city, state, zip_code, imagePath]
    );

    res.status(201).json({ message: "Instituição registrada com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar instituição:", error);
    return res.status(500).json({ message: "Erro no servidor", error });
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
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
