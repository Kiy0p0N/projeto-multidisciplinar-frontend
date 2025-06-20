// Importação dos componentes e bibliotecas
import TextInput from "../input/TextInput";
import PasswordInput from "../input/PasswordInput";
import SelectInput from "../input/SelectInput";
import NumbersInput from "../input/NumbersInput";
import ImgInput from "../input/ImgInput";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Checkbox } from "@mui/material";
import { daysOfWeek, apiUrl } from "../../utils/constants";

function DoctorForm() {
    // Estado para armazenar a lista de instituições
    const [institutions, setInstitution] = useState([]);

    // Estado para preview da imagem
    const [preview, setPreview] = useState(null);

    // Estado para mensagens de erro
    const [error, setError] = useState(null);

    // Estado do formulário
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
        schedule: {},
        password: '',
        confirmPassword: '',
        termsAccepted: true,
        type: 'doctor',
    });

    /**
     * Validação do formulário.
     * Verifica se todos os campos obrigatórios foram preenchidos.
     */
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

    /**
     * Atualiza o preview da imagem ao selecionar um arquivo.
     */
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    /**
     * Atualiza os campos do formulário dinamicamente.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Manipula a seleção de dias disponíveis.
     */
    const handleDayChange = (day) => {
        setForm((prev) => {
            const alreadySelected = prev.availableDays.includes(day);
            return {
                ...prev,
                availableDays: alreadySelected
                    ? prev.availableDays.filter((d) => d !== day)
                    : [...prev.availableDays, day],
            };
        });
    };

    /**
     * Atualiza os horários de início e fim para os dias selecionados.
     */
    const handleScheduleChange = (day, field, value) => {
        setForm((prev) => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    [field]: value,
                },
            },
        }));
    };

    /**
     * Busca todas as instituições cadastradas.
     */
    useEffect(() => {
        const fetchInstitution = async () => {
            try {
                const response = await axios.get(`${apiUrl}/institutions`);
                setInstitution(response.data.institutions);
            } catch (error) {
                if (error.response) {
                    console.warn(error.response.data.message);
                } else {
                    console.error(error);
                }
            }
        };

        fetchInstitution();
    }, []);

    /**
     * Manipula o envio do formulário para o backend.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Adiciona a imagem
            const imgInput = document.getElementById("image");
            if (imgInput?.files.length > 0) {
                formData.append("image", imgInput.files[0]);
            } else {
                setError("Imagem obrigatória.");
                return;
            }

            // Cria o usuário
            const registerUser = await axios.post(`${apiUrl}/register-user`, form);
            if (registerUser.status === 201) {
                const user = registerUser.data.user;

                // Prepara os dados do médico
                Object.entries(form).forEach(([key, value]) => {
                    if (key === "schedule" || key === "availableDays") {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                });

                formData.append("user_id", user.id);

                // Envia os dados do médico
                const registerDoctor = await axios.post(`${apiUrl}/doctor`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (registerDoctor.status === 201) {
                    alert("Médico cadastrado com sucesso.");
                    window.location.reload();
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
        <form onSubmit={handleSubmit} className="form bg-white shadow-lg p-6 rounded-xl space-y-6 max-w-xl mx-auto w-full">
            {/* Mensagem de erro */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Campos de dados pessoais */}
            <TextInput htmlFor="name" label="Nome" name="name" value={form.name} onChange={handleChange} required />
            <TextInput htmlFor="email" label="Email" name="email" value={form.email} onChange={handleChange} required />
            <NumbersInput htmlFor="cpf" label="CPF" name="cpf" blocks={[3,3,3,2]} delimiters={['.', '.', '-']} value={form.cpf} onChange={handleChange} required />
            <NumbersInput htmlFor="phone" label="Telefone" name="phone" blocks={[0,2,0,1,4,4]} delimiters={['(', ')', ' ', ' ', '-']} value={form.phone} onChange={handleChange} required />
            <TextInput htmlFor="birth" label="Data de Nascimento" name="birth" type="date" value={form.birth} onChange={handleChange} required />

            {/* Gênero */}
            <SelectInput
                htmlFor="gender"
                label="Gênero"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                options={[
                    { value: 'masculino', label: 'Masculino' },
                    { value: 'feminino', label: 'Feminino' },
                    { value: 'outro', label: 'Outro' },
                ]}
            />

            {/* Instituição */}
            <SelectInput
                htmlFor="institution"
                label="Instituição"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                required
                options={institutions}
            />

            {/* Especialidade */}
            <TextInput htmlFor="specialty" label="Especialidade" name="specialty" value={form.specialty} onChange={handleChange} required />

            {/* Dias disponíveis */}
            <div>
                <p className="font-semibold">Dias disponíveis para trabalhar:</p>
                {daysOfWeek.map((day) => (
                    <div key={day} className="mb-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={form.availableDays.includes(day)}
                                onChange={() => handleDayChange(day)}
                            />
                            <label className="capitalize">{day}</label>
                        </div>

                        {/* Horário */}
                        {form.availableDays.includes(day) && (
                            <div className="ml-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-2">
                                    <label>Início:</label>
                                    <input
                                        type="time"
                                        required
                                        value={form.schedule[day]?.start || ''}
                                        onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label>Fim:</label>
                                    <input
                                        type="time"
                                        required
                                        value={form.schedule[day]?.end || ''}
                                        onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Upload de imagem */}
            <ImgInput
                htmlFor="image"
                label="Foto de perfil"
                name="image"
                id="image"
                onChange={handleImgChange}
                preview={preview}
            />

            {/* Senha */}
            <PasswordInput htmlFor="password" label="Senha" name="password" value={form.password} onChange={handleChange} required />
            <PasswordInput htmlFor="confirmPassword" label="Confirme sua senha" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} compareTo={form.password} errorMessage="As senhas devem ser iguais." required />

            {/* Botão */}
            <Button type="submit" variant="contained" fullWidth disabled={!isFormValid}>
                Cadastrar médico
            </Button>
        </form>
    );
}

export default DoctorForm;
