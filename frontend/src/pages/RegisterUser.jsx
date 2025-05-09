import {
    Button,
    Checkbox
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CPFInput from '../components/CPFInput';
import TextInput from '../components/TextInput';
import PasswordInput from '../components/PasswordInput';

function RegisterUser() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        cpf: '',
        birthday: '',
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

    // Verifica se o usuário tem ao menos 18 anos
    const isAtLeast18 = () => {
        const birthDate = new Date(form.birthday);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        return (
            age > 18 ||
            (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
        );
    };

    // Verifica se todas as condições estão preenchidas corretamente
    const isFormValid =
        form.name &&
        form.email &&
        form.birthday &&
        isAtLeast18() &&
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        form.termsAccepted;

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
        <main className="w-full min-h-dvh flex flex-col justify-center items-center py-24">
            <form onSubmit={handleSubmit} className="w-96 h-auto p-5 rounded-2xl shadow-2xl flex flex-col gap-2">
                <h1 className="text-3xl text-blue-500 font-medium text-center">Registre-se</h1>

                <p className='text-center'>Preencha todos os campos para se registrar</p>
                

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

                {/* Campo de cpf */}
                <CPFInput
                    htmlFor="cpf"
                    label="CPF"
                    id="cpf"
                    name="cpf"
                    required={true}
                    value={form.cpf}
                    onChange={handleChange}
                />

                {/* Campo de data de nascimento */}
                <TextInput 
                    htmlFor="birthday"
                    label="Data de Nascimento"
                    id="birthday"
                    name="birthday"
                    required={true}
                    type="date"
                    value={form.birthday}
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
                            Termos de uso
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
