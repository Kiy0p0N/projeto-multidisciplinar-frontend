import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Componentes
import Sidebar from "../components/Sidebar";
import DoctorSection from "../components/DoctorSection";
import InstitutionSection from "../components/InstitutionSection";
import AppointmentSection from "../components/AppointmentSection";

// Utils
import { apiUrl } from "../utils/constants";

// Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';

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

    // Buscar dados do paciente
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
    
    // Tela com dados completos
    if (user && patient) {
        return (
            <main className="w-full min-h-dvh flex flex-col md:flex-row py-24 px-4 md:px-8 bg-gray-100 relative gap-6">
                
                {/* Sidebar */}
                <Sidebar
                    infoContent={
                        <div className="text-sm text-gray-800 space-y-2">
                            <p><strong>Nome:</strong> {user.name}</p>
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>CPF:</strong> {patient.cpf}</p>
                            <p><strong>Gênero:</strong> {patient.gender}</p>
                            <p><strong>Telefone:</strong> {patient.phone}</p>
                        </div>
                    }
                    buttons={[
                        {
                            icon: <LocalHospitalIcon className="text-blue-600" />,
                            href: "#medicos",
                            text: "Médicos"
                        },
                        {
                            icon: <BusinessIcon className="text-blue-600" />,
                            href: "#instituicoes",
                        },
                        {
                            icon: <EventIcon className="text-blue-600" />,
                            href: "#agendamentos",
                        },
                    ]}
                />

                {/* Conteúdo principal */}
                <section className="w-full md:w-4/5">
                    <div className="flex flex-col gap-6">
                        {/* Seção de médicos */}
                        <div id="medicos">
                            <DoctorSection patient={patient} />
                        </div>

                        {/* Seção de instituições */}
                        <div id="instituicoes">
                            <InstitutionSection />
                        </div>

                        {/* Seção de agendamentos */}
                        <div id="agendamentos">
                            <AppointmentSection user={user} />
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    // Caso o usuário não seja paciente
    if (user && !patient) {
        return (
            <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white pt-24 pb-12">
                <h1 className="text-4xl font-bold text-red-500">{error}</h1>
            </main>
        );
    }

    // Enquanto carrega
    return null;
}

export default Patient;
