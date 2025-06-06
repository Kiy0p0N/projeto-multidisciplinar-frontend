import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import axios from "axios";
import SearchInput from "../components/input/SearchInput";

function Patient() {
    const [user, setUser] = useState(null);
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Buscar dados do usuário logado
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3000/user", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.user) {
                    if (response.data.user.type === 'patient') {
                        console.log(response.data.user)
                        setUser(response.data.user);
                    } else {
                        setError('Indisponível para seu tipo de usuário');
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                navigate("/login");
            }
        };
        fetchUser();
    }, [navigate]);

    // Buscar dados do paciente (caso já existam)
    useEffect(() => {
        if (user) {
            const fetchPatient = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/patient/${user.id}`);
                    if (response.status === 200 && response.data.patient) {
                        setPatient(response.data.patient);
                    }
                } catch {
                    console.log("Paciente não encontrado");
                }
            };
            fetchPatient();
        }
    }, [user]);

    // Logout
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

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Tela após cadastro completo
    if (user && patient) {
        return (
            <main className="w-full min-h-screen pt-24 pb-10 px-6 bg-gradient-to-br from-white to-blue-50">
                {/* Cabeçalho */}
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-blue-800">Área do Paciente</h1>
                    <p className="text-gray-600 mt-1">Olá, <strong>{user.name}</strong>. Gerencie suas consultas e dados pessoais.</p>
                </header>

                {/* Busca dinâmica */}
                <section className="mb-6 max-w-2xl mx-auto">
                    <SearchInput placeholder="Buscar médicos ou hospitais..." />
                </section>

                {/* Conteúdo em grid */}
                <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
                    {/* Ações do paciente */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl">
                        <h2 className="text-lg font-semibold text-blue-700 mb-4">Consultas</h2>
                        <div className="flex flex-col gap-3">
                            <Button variant="contained">Agendar Consulta</Button>
                            <Button variant="outlined" color="secondary">Cancelar</Button>
                            <Button variant="outlined" color="success">Teleconsulta</Button>
                        </div>
                    </div>

                    {/* Histórico simulado */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl">
                        <h2 className="text-lg font-semibold text-blue-700 mb-4">Histórico</h2>
                        <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
                            <li>15/01/25 - Dr. João (Cardiologia)</li>
                            <li>20/02/25 - Exame de Sangue</li>
                            <li>10/03/25 - Dra. Maria (Clínico Geral)</li>
                        </ul>
                    </div>

                    {/* Dados pessoais */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl">
                        <h2 className="text-lg font-semibold text-blue-700 mb-4 text-center">Seus dados</h2>
                        <div className="text-sm text-gray-800 space-y-2">
                            <p><BadgeIcon fontSize="small" /> <strong>ID:</strong> {user.id}</p>
                            <p><strong>CPF:</strong> {patient.cpf}</p>
                            <p><CalendarMonthIcon fontSize="small" /> <strong>Idade:</strong> {calculateAge(patient.birth_date)}</p>
                            <p><strong>Gênero:</strong> {patient.gender}</p>
                            <p><PhoneIcon fontSize="small" /> <strong>Telefone:</strong> {patient.phone}</p>
                        </div>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<LogoutIcon />}
                            className="w-full mt-6"
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>
                    </div>
                </section>
            </main>
        );
    }

    if (user && !patient) {
        return (
            <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white pt-24 pb-12">
                <h1 className="text-4xl font-bold text-red-500">{error}</h1>
            </main>
        );
    }

    // Caso não possua 
    return null;
}

export default Patient;
