import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import axios from "axios";
import DoctorSection from "../components/DoctorSection";
import InstitutionSection from "../components/InstitutionSection";
import AppointmentSection from "../components/AppointmentSection";
import { apiUrl } from "../utils/constants";

function Patient() {
    const [user, setUser] = useState(null);
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Buscar dados do usuário logado
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user`, {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.user) {
                    if (response.data.user.type === 'patient') {
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
                    const response = await axios.get(`${apiUrl}/patient/${user.id}`);
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
            const response = await axios.get(`${apiUrl}/logout`, {
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
            <main className="w-full min-h-dvh flex py-24 bg-gray-100 relative">
            
                {/* Dados pessoais */}
                <aside className="w-1/5 bg-white p-5 shadow-md h-fit sticky top-24 self-start rounded-xl">
                    <h2 className="text-lg font-semibold text-blue-700 mb-4 text-center">Seus dados</h2>
                    <div className="text-sm text-gray-800 space-y-2">
                        <p><strong>Nome:</strong> {user.name}</p>
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
                </aside>

                {/* Conteúdo principal */}
                <section className="w-4/5 px-8">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Médicos */}
                        <DoctorSection patient={patient}/>

                        {/* Instituições */}
                        <InstitutionSection />

                        {/* Agendamentos */}
                        <AppointmentSection patient={patient}/>
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
