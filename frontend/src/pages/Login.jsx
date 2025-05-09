import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import PasswordInput from '../components/PasswordInput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

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
    form.email &&
    form.password;

    
    const navigate = useNavigate();

    // Submete o formulário apenas se estiver válido
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            console.log('Dados do formulário:', form);
            navigate('/user');
        } else {
            alert('Verifique os campos preenchidos. Certifique-se de ter mais de 18 anos e que as senhas coincidem.');
        }
    };

    return (
        <div className="w-full min-h-dvh">

            <main className="flex flex-col w-full h-dvh justify-center items-center">
                <form onSubmit={handleSubmit} className='w-96 h-auto p-5 flex flex-col gap-2 shadow-2xl rounded-2xl'>

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

                    {/* Botão de envio, só habilitado quando o formulário é válido */}
                    <Button type="submit" variant="contained" className="w-full" disabled={!isFormValid}>
                        Entrar
                    </Button>

                    <hr />
                    
                    {/* Link para o formulário de criação da conta */}
                    <p className='text-center'>
                        Não tem conta? <Link to="/register" className='text-blue-500 hover:underline hover:text-blue-400 duration-150'>
                                            Cadastre-se
                                        </Link>
                    </p>
                </form>
            </main>

        </div>
    );
}

export default Login;