import TextInput from "../input/TextInput";
import PasswordInput from "../input/PasswordInput";
import SelectInput from "../input/SelectInput";
import NumbersInput from "../input/NumbersInput";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Button, Checkbox } from "@mui/material";
import { apiUrl } from "../../utils/constants";

function UserForm() {
    // Armazena erros de validação ou requisição
    const [error, setError] = useState('');

    // Estado do formulário do usuário
    const [form, setForm] = useState({
        name: '',
        email: '',
        cpf: '',
        birth_date: '',
        phone: '',
        gender: '',
        user_id: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const navigate = useNavigate();

    // Atualiza dinamicamente os campos do formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Validação básica: todos campos devem estar preenchidos, senha igual e termos aceitos
    const isFormValid =
        form.name.trim() &&
        form.email.trim() &&
        form.cpf.trim() &&
        form.birth_date.trim() &&
        form.phone.trim() &&
        form.gender.trim() &&
        form.password.trim() &&
        form.confirmPassword.trim() &&
        form.password === form.confirmPassword &&
        form.termsAccepted;

    // Submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isFormValid) {
            try {
                // Envia dados para criação de usuário
                const registerUser = await axios.post(`${apiUrl}/register-user`, form, {
                    withCredentials: true
                });

                if (registerUser.status === 201) {
                    const user = registerUser.data.user;

                    // Cria dados do paciente com ID do usuário
                    const patientData = {
                        ...form,
                        user_id: user.id
                    };

                    // Registra paciente no sistema
                    const registerPatient = await axios.post(`${apiUrl}/patient`, patientData, {
                        withCredentials: true
                    });

                    if (registerPatient.status === 201) {
                        navigate("/patient");
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
        <form onSubmit={handleSubmit} className="form shadow-lg space-y-6">
            {/* Mensagem de erro exibida dinamicamente */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Nome completo */}
            <TextInput
                htmlFor="name"
                label="Nome"
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
            />

            {/* Email */}
            <TextInput
                htmlFor="email"
                label="Email"
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
            />

            {/* CPF com formatação */}
            <NumbersInput
                htmlFor="cpf"
                label="CPF"
                id="cpf"
                name="cpf"
                value={form.cpf}
                delimiters={['.', '.', '-']}
                blocks={[3, 3, 3, 2]}
                minLength={14}
                onChange={handleChange}
                required
            />

            {/* Telefone com máscara */}
            <NumbersInput
                htmlFor="phone"
                label="Telefone"
                id="phone"
                name="phone"
                value={form.phone}
                delimiters={['(', ')', ' ', ' ', '-']}
                blocks={[0, 2, 0, 1, 4, 4]}
                minLength={16}
                onChange={handleChange}
                required
            />

            {/* Data de nascimento */}
            <TextInput
                htmlFor="birth_date"
                label="Data de nascimento"
                id="birth_date"
                name="birth_date"
                type="date"
                value={form.birth_date}
                onChange={handleChange}
                required
            />

            {/* Gênero (select) */}
            <SelectInput
                htmlFor="gender"
                label="Gênero"
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                options={[
                    { value: "masculino", label: "Masculino" },
                    { value: "feminino", label: "Feminino" },
                    { value: "outro", label: "Outro" }
                ]}
            />

            {/* Senha */}
            <PasswordInput
                htmlFor="password"
                label="Senha"
                id="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
            />

            {/* Confirmação de senha */}
            <PasswordInput
                htmlFor="confirmPassword"
                label="Confirme a senha"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                compareTo={form.password}
                errorMessage="As senhas devem ser iguais."
            />

            {/* Termos de uso */}
            <div className="flex items-center text-sm">
                <Checkbox
                    checked={form.termsAccepted}
                    onChange={handleChange}
                    name="termsAccepted"
                    id="termsAccepted"
                />
                <label htmlFor="termsAccepted" className="text-gray-700">
                    Aceite os{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                        termos de uso
                    </Link>
                </label>
            </div>

            {/* Botão enviar */}
            <Button type="submit" variant="contained" className="w-full" disabled={!isFormValid}>
                Registrar-se
            </Button>
        </form>
    );
}

export default UserForm;
