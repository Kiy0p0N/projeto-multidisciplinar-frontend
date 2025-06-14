import TextInput from "../input/TextInput";
import PasswordInput from "../input/PasswordInput";
import SelectInput from "../input/SelectInput";
import NumbersInput from "../input/NumbersInput";
import ImgInput from "../input/ImgInput";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Checkbox } from "@mui/material";
import { daysOfWeek, apiUrl } from "../../utils/constants"; // ['segunda', 'terça', ...]

function DoctorForm() {
    const [institutions, setInstitution] = useState([]);
    const [preview, setPreview] = useState(null); // Estado para armazenar o preview da imagem selecionada
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        cpf: '',
        phone: '',
        birth: '',
        gender: '',
        institution: '',
        specialty: '',
        availableDays: [],
        schedule: {}, // Ex: { segunda: { start: '08:00', end: '17:00' }, ... }
        password: '',
        confirmPassword: '',
        termsAccepted: true,
        type: 'doctor',
    });

    const isFormValid = 
        form.name.trim() &&
        form.email.trim() &&
        form.cpf.trim() &&
        form.phone.trim() &&
        form.birth.trim() &&
        form.gender.trim() &&
        form.institution.trim() &&
        form.specialty.trim() &&
        form.availableDays.length > 0 &&
        form.availableDays.every(day => form.schedule[day]?.start && form.schedule[day]?.end) &&
        form.password.trim() &&
        form.password === form.confirmPassword &&
        preview;

    // Função para atualizar a imagem
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); // Gera um preview da imagem
        }
    }

    // Função para atualizar o estado do formulário ao digitar nos inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Atualiza dias disponíveis
    const handleDayChange = (day) => {
        setForm((prev) => {
            const alreadySelected = prev.availableDays.includes(day);
            return {
                ...prev,
                availableDays: alreadySelected
                    ? prev.availableDays.filter((d) => d !== day)
                    : [...prev.availableDays, day]
            };
        });
    };

    // Atualiza horário (início ou fim) por dia
    const handleScheduleChange = (day, field, value) => {
        setForm((prev) => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    [field]: value
                }
            }
        }));
    };

    // Pega todas as instituições
    useEffect(() => {
        const fetchInstitution = async () => {
            try {
                const response = await axios.get(`${apiUrl}/institutions`);
                setInstitution(response.data.institutions);
            } catch (error) {
                if (error.response) return console.warn(error.response.data.message);
                return console.error(error);
            }
        }

        fetchInstitution();
    }, []);

    // Função para enviar os dados do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Verifica se há imagem
            const imgInput = document.getElementById("image");
            if (imgInput?.files.length > 0) {
                formData.append("image", imgInput.files[0]);
            } else {
                setError("Imagem obrigatória");
                return;
            }

            // Primeiro registra o usuário
            const registerUser = await axios.post(`${apiUrl}/register-user`, form);
            if (registerUser.status === 201) {
                const user = registerUser.data.user;

                // Adiciona campos ao FormData
                Object.entries(form).forEach(([key, value]) => {
                    if (key === "schedule" || key === "availableDays") {
                        formData.append(key, JSON.stringify(value)); // converte para JSON string
                    } else {
                        formData.append(key, value);
                    }
                });

                // Adiciona user_id separado (não vem no form original)
                formData.append("user_id", user.id);

                // Envia os dados do médico
                const registerDoctor = await axios.post(`${apiUrl}/doctor`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (registerDoctor.status === 201) {
                    alert("Médico registrado com sucesso");
                    window.location.reload(); // Força o refresh da página
                }
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Erro ao enviar dados.");
                console.warn("Erro do servidor:", error.response.data);
            } else {
                setError("Erro ao conectar ao servidor.");
                console.error("Erro desconhecido:", error);
            }
        }
    };


    return (
        <form onSubmit={handleSubmit} className="form shadow-lg">

            {/* Exibição de erros, se houver */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Campo para nome do médico */}
            <TextInput
                htmlFor='name'
                label='Nome'
                name='name'
                value={form.name}
                onChange={handleChange}
                required
            />

            {/* Campo para email do médico */}
            <TextInput
                htmlFor='email'
                label='Email'
                name='email'
                value={form.email}
                onChange={handleChange}
                required
            />

            {/* Campo para o cpf do médico */}
            <NumbersInput
                htmlFor='cpf'
                label='CPF'
                name='cpf'
                blocks={[3,3,3,2]}
                delimiters={['.', '.', '-']}
                value={form.cpf}
                onChange={handleChange}
                required
            />

            {/* Campo para o telefone de contato */}
            <NumbersInput
                htmlFor='phone'
                label='Telefone para contato'
                name='phone'
                blocks={[0,2,0,1,4,4]}
                delimiters={['(', ')', ' ', ' ', '-']}
                value={form.phone}
                onChange={handleChange}
                required
            />

            {/* Campo para data de nascimento */}
            <TextInput
                htmlFor='birth'
                label='Data de nascimento'
                name='birth'
                type='date'
                value={form.birth}
                onChange={handleChange}
                required
            />

            {/* Campo para o gênero */}
            <SelectInput
                htmlFor='gender'
                label='Gênero'
                name='gender'
                value={form.gender}
                onChange={handleChange}
                required

                options={[
                    {value: 'masculino', label: 'Masculino'},
                    {value: 'feminino', label: 'Feminino'},
                    {value: 'outro', label: 'Outro'}
                ]}
            />

            {/* Campo para selecionar as instituições */}
            <SelectInput
                htmlFor='institution'
                label='Instituição em que atua'
                name='institution'
                value={form.institution}
                onChange={handleChange}
                required

                options={institutions}
            />

            {/* Campo para a especialidade */}
            <TextInput
                htmlFor='specialty'
                label='Especialidade'
                name='specialty'
                value={form.specialty}
                onChange={handleChange}
                required
            />

            {/* Seleção de dias e horários */}
            <div>
                <p className="font-semibold mt-4">Dias disponíveis para trabalhar (obrigatório):</p>
                {daysOfWeek.map((day) => (
                    <div key={day} className="mb-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={form.availableDays.includes(day)}
                                onChange={() => handleDayChange(day)}
                            />
                            <label className="capitalize">{day}</label>
                        </div>

                        {form.availableDays.includes(day) && (
                            <div className="ml-6 flex gap-2">
                                <label>Início:</label>
                                <input
                                    type="time"
                                    required
                                    value={form.schedule[day]?.start || ''}
                                    onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                />
                                <label>Fim:</label>
                                <input
                                    type="time"
                                    required
                                    value={form.schedule[day]?.end || ''}
                                    onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Campo para imagem do médico */}
            <ImgInput
                htmlFor='image'
                label='Foto de perfil'
                name='image'
                id='image'
                onChange={handleImgChange}
                preview={preview}
            />

            {/* Campo para definição da senha */}
            <PasswordInput
                htmlFor='password'
                label='Senha'
                name='password'
                value={form.password}
                onChange={handleChange}
                required
            />

            {/* Campo para confirmar a senha */}
            <PasswordInput
                htmlFor='confirmPassword'
                label='Corfirme sua senha'
                name='confirmPassword'
                value={form.confirmPassword}
                onChange={handleChange}compareTo={form.password}
                errorMessage="As senhas devem ser iguais."
                required
            />

            {/* Botão de envio do cadastro */}
            <Button type="submit" variant="contained" disabled={!isFormValid}>
                Cadastrar médico
            </Button>
        </form>
    )
}

export default DoctorForm;
