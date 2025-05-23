import axios from 'axios';

import { Button, Checkbox } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../components/input/TextInput';
import PasswordInput from '../components/input/PasswordInput';

function RegisterUser() {
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const navigate = useNavigate();

    // Atualiza os campos do formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Verifica se todas as condições estão preenchidas corretamente
    const isFormValid =
        form.name.trim() &&
        form.email.trim() &&
        form.password.trim() &&
        form.confirmPassword.trim() &&
        form.password === form.confirmPassword &&
        form.termsAccepted;

    // Submete o formulário apenas se estiver válido
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isFormValid) {

            try {
                const response = await axios.post("http://localhost:3000/register-user", 
                    form,
                    {
                        withCredentials: true // Garante que o cookie de sessão seja armazenado
                    },
                );

                if (response.status === 201) {
                    const user = response.data.user;
                    console.log(user)
                    
                    // Redireciona com base no tipo de usuário
                    if (user?.type === "admin" || user?.type === "doctor" || user?.type === "patient") {
                        navigate(`/${user.type}`);
                    } else {
                        setError("Tipo de usuário inválido.");
                    }
                } 

            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message);
                    console.warn("Erro do servidor:", error.response.data.message);
                } else {
                    console.error("Erro desconhecido:", error);
                }
            }
        }
    };


    return (
        <main className="container justify-center items-center py-24">
            <form onSubmit={handleSubmit} className="w-96 h-auto p-5 rounded-2xl shadow-2xl flex flex-col gap-2">
                <h1 className="text-3xl text-blue-500 font-medium text-center">Registre-se</h1>

                <p className='text-center'>Preencha todos os campos para se registrar</p>
                
                <p className='text-center text-red-500'>{error}</p>

                {/* Campo de nome completo */}
                <TextInput 
                    htmlFor="name"
                    label="Nome"
                    id="name"
                    name="name"
                    required={true}
                    value={form.name}
                    onChange={handleChange}
                />

                {/* Campo de email */}
                <TextInput 
                    htmlFor="email"
                    label="Email"
                    id="email"
                    name="email"
                    required={true}
                    value={form.email}
                    onChange={handleChange}
                />

                {/* Campo de senha com visualização opcional */}
                <PasswordInput
                    htmlFor="password"
                    label="Senha"
                    id="password"
                    name="password"
                    required={true}
                    value={form.password}
                    onChange={handleChange}
                />


                {/* Campo para confirmar senha */}
                <PasswordInput
                    htmlFor="confirmPassword"
                    label="Confirme a senha"
                    id="confirmPassword"
                    name="confirmPassword"
                    required={true}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    compareTo={form.password}
                    errorMessage="As senhas devem ser iguais."
                />


                {/* Checkbox dos termos de uso */}
                <div className="flex items-center">
                    <Checkbox
                        checked={form.termsAccepted}
                        onChange={handleChange}
                        name="termsAccepted"
                        id="termsAccepted"
                    />
                    <label htmlFor="termsAccepted">
                        Aceite os{' '}
                        <span className="text-blue-500 cursor-pointer hover:underline">
                            <Link to="/terms">Termos de uso</Link>
                        </span>
                    </label>
                </div>

                {/* Botão de envio, só habilitado quando o formulário é válido */}
                <Button type="submit" variant="contained" className="w-full" disabled={!isFormValid}>
                    Registrar-se
                </Button>
            </form>
        </main>
    );
}

export default RegisterUser;
