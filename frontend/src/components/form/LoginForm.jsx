import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@mui/material';
import TextInput from '../input/TextInput';
import PasswordInput from '../input/PasswordInput';
import { apiUrl } from '../../utils/constants';

function LoginForm() {
    // Estado do formulário: email e senha
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    // Armazena mensagens de erro (ex: usuário inválido)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Atualiza os campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Verifica se os campos obrigatórios foram preenchidos
    const isFormValid = form.email.trim() !== '' && form.password.trim() !== '';

    // Submete o formulário para autenticação
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        try {
            const response = await axios.post(`${apiUrl}/login`, form, {
                withCredentials: true // Garante que o cookie de sessão seja armazenado
            });

            if (response.status === 200) {
                const user = response.data.user;

                // Redireciona conforme o tipo de usuário
                if (user?.type === "admin" || user?.type === "doctor" || user?.type === "patient") {
                    navigate(`/${user.type}`);
                } else {
                    setError("Tipo de usuário inválido.");
                }
            }

        } catch (error) {
            // Exibe erros específicos ou genéricos
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exibe erro, se houver */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Campo: E-mail */}
            <TextInput 
                htmlFor="email"
                label="Email"
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
            />

            {/* Campo: Senha */}
            <PasswordInput
                htmlFor="password"
                label="Senha"
                id="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
            />

            {/* Botão: Enviar */}
            <Button 
                type="submit" 
                variant="contained" 
                className="w-full" 
                disabled={!isFormValid}
            >
                Entrar
            </Button>

            {/* Para ter um espaçamento entre o botão de enviar e o link de cadastro */}
            <div></div>

            {/* Link: Cadastro */}
            <p className="text-center text-sm">
                Não tem conta?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Cadastre-se
                </Link>
            </p>
        </form>
    );
}

export default LoginForm;
