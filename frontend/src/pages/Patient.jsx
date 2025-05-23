import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";

import NumbersInput from "../components/input/NumbersInput";
import TextInput from "../components/input/TextInput";
import SelectInput from "../components/input/SelectInput";

function Patient() {
    const [user, setUser] = useState(null); // Armazena o usuário logado
    const [patient, setPatient] = useState(null); // Armazena o paciente, se houver
    const [form, setForm] = useState({
        cpf: '',
        birth_date: '',
        phone: '',
        gender: '',
        user_id: '',
    });

    const navigate = useNavigate();

    // Busca o usuário da sessão ao montar o componente
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3000/user", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.user) {
                    setUser(response.data.user);
                    // Define o user_id no formulário para enviar depois
                    setForm(prev => ({
                        ...prev,
                        user_id: response.data.user.id
                    }));
                } else {
                    console.log("Usuário não encontrado");
                }

            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    // Busca os dados do paciente, após o usuário estar disponível
    useEffect(() => {
        if (user) {
            const fetchPatient = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/patient/${user.id}`);
                    if (response.status === 200 && response.data.patient) {
                        setPatient(response.data.patient);
                    }
                } catch (error) {
                    console.log("Paciente não encontrado (provavelmente novo usuário)");
                }
            };

            fetchPatient();
        }
    }, [user]);

    // Logout do sistema
    const handleLogout = async () => {
        try {
            const response = await axios.get("http://localhost:3000/logout", {
                withCredentials: true,
            });

            if (response.status === 200) {
                navigate("/");
            }

        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    // Atualiza o estado do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Validação básica do formulário
    const isFormValid =
        form.cpf.trim() &&
        form.birth_date.trim() &&
        form.phone.trim() &&
        form.gender.trim() &&
        form.user_id;

    // Submete os dados do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/patient", form, {
                withCredentials: true,
            });

            if (response.status === 201 && response.data.patient) {
                setPatient(response.data.patient);
            }
        } catch (error) {
            console.error("Erro ao registrar paciente:", error);
        }
    };

    // if (patient) {
    //     // Função para calcular a idade
        

    //     setAge(calculateAge(patient.birth_date));
    // }
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);

        let currentAge = today.getFullYear() - birth.getFullYear();
        const month = today.getMonth() - birth.getMonth();

        if (month < 0 || (month === 0 && today.getDate() < today.getDate())) {
            currentAge--;
        }
        return currentAge;
    };

    // Página principal do paciente
    if (user && patient) return (
        <main className="w-full min-h-dvh pt-24 pb-8 flex gap-4 z-30">

            <div className="w-1/5 bg-blue-50 p-5 flex flex-col">
                <h1> </h1>
            </div>

            <div className="w-3/5 bg-blue-50 p-5 flex flex-col">
                <h1> </h1>
            </div>

            {/* Painel lateral com dados do usuário */}
            <div className="w-1/5 bg-blue-50 p-5 flex flex-col">
                <h1 className="text-[20px] font-bold text-center">Informações do Paciente</h1>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Nome:</strong> {user.name}</p>

                {patient && (
                    <>
                    <p><strong>CPF:</strong> {patient.cpf}</p>
                    <p><strong>Idade:</strong> {calculateAge(patient.birth_date)}</p>
                    <p><strong>Gênero:</strong> {patient.gender}</p>
                    </>
                )}

                <Button variant="contained" color="error" onClick={handleLogout}>
                    Sair
                </Button>
            </div>
        </main>
    );
    
    // Se o paciente ainda não estiver com todos os dados cadastrados, mostra o formulário
    if (user && !patient) {
        return (
            <main className="container justify-center items-center">
                {!patient && (
                    <form onSubmit={handleSubmit} className="w-96 p-6 rounded-xl shadow-xl flex flex-col gap-4 bg-white">
                        <h2 className="text-center font-bold text-lg mb-2">Complete seu cadastro</h2>

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

                        <Button type="submit" variant="contained" disabled={!isFormValid}>
                            Enviar
                        </Button>
                    </form>
                )}
            </main>
        );
    }

    // Caso o usuário não tenha sido encontrado
    return (
        <main className="container pt-20 flex items-center justify-center gap-4 z-30">
            <h1 className="text-4xl font-bold text-red-600">Usuário não encontrado</h1>
        </main>
    );
}

export default Patient;
