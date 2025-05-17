// Importando os módulos necessários
import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';

const app = express();  // Inicia a aplicação Express
const port = 3000;  // Define a porta onde o app irá rodar
const salt = 10;
env.config();  // Carrega o arquivo .env

// Configura o cliente PostgreSQL
const db = new pg.Client({
    user:process.env.PG_USER,
    database:process.env.PG_DB,
    host:process.env.PG_HOST,
    password:process.env.PG_PASSWORD,
    port:process.env.PG_PORT
});

// Tenta estabilizar a conexão com o db
try {
    db.connect();
    console.log("Connected to the database.");
} catch (error) {
    console.error("Error connecting to database: ", error);
}

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Solicitação post para login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        const user = checkUser.rows[0];

        if (!user) {  // Caso o email não esteja no banco de dados
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);  // Compara a senha passada no formulário com a senha registrada cadastrada

        if (!passwordMatch) {  // Caso a senha esteja incorreta
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }

        // Caso tenha sido autenticado com sucesso
        return res.status(200).json({ message: "Usuário autenticado com sucesso" });

    } catch (error) {
        console.error("Erro ao tentar buscar no banco de dados: ", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

// Solicitação post para registro de novo usuário
app.post("/register-user", async (req, res) => {
    const {name, email, password, termsAccepted} = req.body;

    try {
        const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        const user = checkUser.rows[0];

        if (user) {  // Caso o email já esteja cadastrado
            return res.status(401).json({ message: "O email já existe, Utilize outro ou tente entrar" });

        } else {
            try {
                bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {  // Erro ao criar a senha hash
                    console.log("Erro ao criar a senha hash: ", err);
                    res.status(500).json({ error: "Erro ao processar a senha" });
                } else {
                    await db.query(
                        "INSERT INTO users (name, email, password, accepted_terms) VALUES ($1, $2, $3, $4)",
                        [name, email, hash, termsAccepted],
                    );

                    res.status(200).json({ message: "Usuário criado com sucesso" });
                }
            });
            } catch (error) {
                console.log("Erro ao tentar registrar usuário:", error);
                res.status(500).json({ error: "Erro ao processar a senha" });
            }
        }

    } catch (error) {
        console.error("Database query error: ", error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
