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
    const [error, setError] = useState('');
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
        form.cpf.trim() &&
        form.birth_date.trim() &&
        form.phone.trim() &&
        form.gender.trim() &&
        form.password.trim() &&
        form.confirmPassword.trim() &&
        form.password === form.confirmPassword &&
        form.termsAccepted;

    // Submete o formulário apenas se estiver válido
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isFormValid) {
            try {
                const registerUser = await axios.post(`${apiUrl}/register-user`, form,
                    { withCredentials: true }
                );

                if (registerUser.status === 201) {
                    const user = registerUser.data.user;
                    console.log("Novo ID do usuário:", user.id);

                    // Crie um novo objeto com todos os dados + user_id
                    const patientData = {
                        ...form,
                        user_id: user.id
                    };

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
        <form 
            onSubmit={handleSubmit} 
            className="form shadow-lg"
        >
            
            {/* Exibição de erros, se houver */}
            {error && <p className="text-center text-red-500">{error}</p>}

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
                type="email"
                required={true}
                value={form.email}
                onChange={handleChange}
            />

            {/* Campo para informar o cpf */}
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

            {/* Campo para informar o telefone */}
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

            {/* Campo para selecionar a data de aniversário */}
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

            {/* Campo para selecionar o gênero */}
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
    )
}

export default UserForm;