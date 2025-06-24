import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, IconButton } from "@mui/material";

// Ícones
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';

import Sidebar from "../components/Sidebar";

import InstitutionForm from "../components/form/InstitutionForm";
import PatientSection from "../components/PatientSection";
import InstitutionSection from "../components/InstitutionSection";
import DoctorForm from "../components/form/DoctorForm";
import DoctorSection from "../components/DoctorSection";

import { apiUrl } from "../utils/constants";

function Admin() {
    const [admin, setAdmin] = useState(null);
    const [showInstitutionForm, setShowInstitutionForm] = useState(false);
    const [showDoctorForm, setDoctorForm] = useState(false);

    const navigate = useNavigate();

    // Verifica sessão
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    const user = response.data.user;
                    if (user.type === 'admin') {
                        setAdmin(user);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                navigate('/login');
            }
        };

        fetchAdmin();
    }, [navigate]);

    // Controle dos formulários
    const toggleInstitutionForm = () => setShowInstitutionForm(prev => !prev);
    const toggleDoctorForm = () => setDoctorForm(prev => !prev);

    if (!admin) return null;

    return (
        <main className="w-full min-h-dvh flex flex-col md:flex-row py-24 px-4 md:px-8 bg-gray-100 gap-6">

            {/* Sidebar */}
            <Sidebar
                infoContent={
                    <div className="text-sm text-gray-800 space-y-2 flex flex-col gap-4">
                        {/* Cadastro */}
                        <Button variant="contained" startIcon={<MedicalServicesIcon />} onClick={toggleDoctorForm}>
                            Cadastrar Profissional
                        </Button>

                        <Button variant="contained" startIcon={<LocalHospitalIcon />} onClick={toggleInstitutionForm}>
                            Cadastrar Instituição
                        </Button>
                    </div>
                }
                buttons={[
                    { icon: <PeopleIcon className="text-blue-600" />, href: "#pacientes" },
                    { icon: <MedicalServicesIcon className="text-blue-600" />, href: "#medicos" },
                    { icon: <BusinessIcon className="text-blue-600" />, href: "#instituicoes" },
                ]}
            />

            {/* Conteúdo principal */}
            <section className="w-full md:w-4/5">
                <div className="flex flex-col gap-6">
                    {/* Seções */}
                    <div id="pacientes">
                        <PatientSection />
                    </div>

                    <div id="medicos">
                        <DoctorSection />
                    </div>

                    <div id="instituicoes">
                        <InstitutionSection />
                    </div>
                </div>
            </section>

            {/* Formulário sobreposto - Instituição */}
            {showInstitutionForm && (
                <div className="fixed inset-0 bg-zinc-400/80 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
                        <IconButton
                            onClick={toggleInstitutionForm}
                            className="absolute top-2 right-2"
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                        <h2 className="text-xl font-semibold mb-4 text-center text-purple-600">
                            Adicionar Instituição
                        </h2>
                        <InstitutionForm />
                    </div>
                </div>
            )}

            {/* Formulário sobreposto - Médico */}
            {showDoctorForm && (
                <div className="fixed inset-0 bg-zinc-400/80 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
                        <IconButton
                            onClick={toggleDoctorForm}
                            className="absolute top-2 right-2"
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                        <h2 className="text-xl font-semibold mb-4 text-center text-purple-600">
                            Adicionar Médico
                        </h2>
                        <DoctorForm />
                    </div>
                </div>
            )}
        </main>
    );
}

export default Admin;
