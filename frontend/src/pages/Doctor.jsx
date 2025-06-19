import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

// Ícones
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";

import axios from "axios";

import SidebarMobile from "../components/SidebarMobile";

import PatientSection from "../components/PatientSection";
import AppointmentSection from "../components/AppointmentSection";

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

    // Renderização principal
    if (user && doctor) {
        return (
            <main className="w-full min-h-dvh flex flex-col md:flex-row py-24 px-4 md:px-8 bg-gray-100 gap-6">

                {/* Sidebar Mobile */}
                <SidebarMobile
                    infoContent={
                        <div className="text-sm text-gray-800 space-y-2">
                            <p><strong>Nome:</strong> {user.name}</p>
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>CPF:</strong> {doctor.cpf}</p>
                            <p><strong>Gênero:</strong> {doctor.gender}</p>
                            <p><strong>Telefone:</strong> {doctor.phone}</p>
                            <p><strong>Instituição:</strong> {doctor.institution_name || "—"}</p>
                            <p><strong>Especialidade:</strong> {doctor.specialty}</p>
                        </div>
                    }
                    buttons={[
                        { icon: <PeopleIcon className="text-blue-600" />, href: "#pacientes" },
                        { icon: <EventIcon className="text-blue-600" />, href: "#agendamentos" },
                    ]}
                />

                {/* Sidebar Desktop */}
                <aside className="hidden md:block w-1/5 bg-white p-5 shadow-md h-fit sticky top-24 self-start rounded-xl">
                    <div className="text-sm text-gray-800 space-y-2">
                        <p><strong>Nome:</strong> {user.name}</p>
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>CPF:</strong> {doctor.cpf}</p>
                        <p><strong>Gênero:</strong> {doctor.gender}</p>
                        <p><strong>Telefone:</strong> {doctor.phone}</p>
                        <p><strong>Instituição:</strong> {doctor.institution_name || "—"}</p>
                        <p><strong>Especialidade:</strong> {doctor.specialty}</p>
                    </div>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon />}
                        className="w-full mt-6"
                        onClick={handleLogout}
                    >
                        Finalizar Sessão
                    </Button>
                </aside>

                {/* Conteúdo principal */}
                <section className="w-full md:w-4/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Seções */}
                        <div id="pacientes">
                            <PatientSection doctorId={doctor.id} />
                        </div>

                        <div id="agendamentos">
                            <AppointmentSection user={user} />
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    // Se usuário não for médico
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
