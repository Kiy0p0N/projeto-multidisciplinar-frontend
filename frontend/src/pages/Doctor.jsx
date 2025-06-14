import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import axios from "axios";
import PatientSection from "../components/PatientSection";
import { apiUrl } from "../utils/constants";

function Doctor() {
    const [user, setUser] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Buscar usuário logado
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user`, {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.user) {
                    if (response.data.user.type === 'doctor') {
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

    // Buscar dados do médico
    useEffect(() => {
        if (user) {
            const fetchDoctor = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/doctor/${user.id}`);
                    if (response.status === 200 && response.data.doctor) {
                        setDoctor(response.data.doctor);
                    }
                } catch {
                    console.log("Médico não encontrado");
                }
            };
            fetchDoctor();
        }
    }, [user]);

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

    if (user && doctor) {
        return (
            <main className="w-full min-h-dvh flex py-24 bg-gray-100 relative">
                {/* Dados do médico */}
                <aside className="w-1/5 bg-white p-5 shadow-md h-fit sticky top-24 self-start rounded-xl">
                    <h2 className="text-lg font-semibold text-blue-700 mb-4 text-center">Seus dados</h2>
                    <div className="text-sm text-gray-800 space-y-2">
                        <p><strong>Nome:</strong> {user.name}</p>
                        <p><BadgeIcon fontSize="small" /> <strong>ID:</strong> {user.id}</p>
                        <p><strong>CPF:</strong> {doctor.cpf}</p>
                        <p><CalendarMonthIcon fontSize="small" /> <strong>Idade:</strong> {calculateAge(doctor.birth)}</p>
                        <p><strong>Gênero:</strong> {doctor.gender}</p>
                        <p><PhoneIcon fontSize="small" /> <strong>Telefone:</strong> {doctor.phone}</p>
                        <p><LocalHospitalIcon fontSize="small" /> <strong>Instituição:</strong> {doctor.institution_name || "—"}</p>
                        <p><WorkIcon fontSize="small" /> <strong>Especialidade:</strong> {doctor.specialty}</p>
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
                        {/* Pacientes e agendamentos */}
                        <PatientSection doctorId={doctor.id} />
                    </div>
                </section>
            </main>
        );
    }

    if (user && !doctor) {
        return (
            <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white pt-24 pb-12">
                <h1 className="text-4xl font-bold text-red-500">{error}</h1>
            </main>
        );
    }

    return null;
}

export default Doctor;
