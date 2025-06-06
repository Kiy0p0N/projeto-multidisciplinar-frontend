import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import axios from 'axios';

import { Button } from '@mui/material';
import TextInput from '../input/TextInput';
import PasswordInput from '../input/PasswordInput';

function LoginForm() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(''); // Armazena mensagens de erro
    const navigate = useNavigate();

    // Atualiza o estado do formulário a cada digitação
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Verifica se o formulário está preenchido
    const isFormValid = form.email.trim() !== '' && form.password.trim() !== '';

    // Submete o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        try {
            const response = await axios.post(
                "http://localhost:3000/login",
                form,
                {
                    withCredentials: true // Garante que o cookie de sessão seja armazenado
                }
            );

            if (response.status === 200) {
                const user = response.data.user;

                // Redireciona com base no tipo de usuário
                if (user?.type === "admin" || user?.type === "doctor" || user?.type === "patient") {
                    navigate(`/${user.type}`);
                } else {
                    setError("Tipo de usuário inválido.");
                }
            }

        } catch (error) {
            // Tratamento de erro vindo do servidor
            if (error.response) {
                setError(error.response.data.message || "Erro ao fazer login.");
                console.warn("Erro do servidor:", error.response.data);
            } else {
                setError("Erro ao conectar ao servidor.");
                console.error("Erro desconhecido:", error);
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="form shadow-lg"
        >
            {/* Exibição de erros, se houver */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Campo de e-mail */}
            <TextInput 
                htmlFor="email"
                label="Email"
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
            />

            {/* Campo de senha */}
            <PasswordInput
                htmlFor="password"
                label="Senha"
                id="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
            />

            {/* Botão de login */}
            <Button 
                type="submit" 
                variant="contained" 
                className="w-full" 
                disabled={!isFormValid}
            >
                Entrar
            </Button>

            <hr />

            {/* Link para página de cadastro */}
            <p className="text-center text-sm">
                Não tem conta?{" "}
                <Link 
                    to="/register" 
                    className="text-blue-600 hover:underline"
                >
                    Cadastre-se
                </Link>
            </p>
        </form>
    );
}

export default LoginForm;