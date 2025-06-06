import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, IconButton } from "@mui/material";

// Ícones do Material UI
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HotelIcon from '@mui/icons-material/Hotel';
import CloseIcon from '@mui/icons-material/Close';

import SearchInput from "../components/input/SearchInput";
import InstitutionForm from "../components/form/InstitutionForm";
import PatientSection from "../components/PatientSection";
import InstitutionSection from "../components/InstitutionSection";
import DoctorForm from "../components/form/DoctorForm";
import DoctorSection from "../components/DoctorSection";

function Admin() {
    const [admin, setAdmin] = useState(null);
    const [showInstitutionForm, setShowInstitutionForm] = useState(false); // Estado para mostrar/ocultar formulário
    const [showDoctorForm, setDoctorForm] = useState(false);

    const navigate = useNavigate();

    // Verifica a sessão e obtém dados do admin
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get("http://localhost:3000/user", {
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

    // Faz logout e redireciona para a página inicial
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

    // Alterna exibição do formulário
    const toggleInstitutionForm = () => {
        setShowInstitutionForm(prev => !prev);
    };

    const toggleDoctorForm = () => {
        setDoctorForm(prev => !prev);
    };
    
    // Enquanto admin não é carregado, não renderiza
    if (!admin) return null;

    return (
        <main className="w-full min-h-dvh flex py-24 bg-gray-100 relative">
            {/* Formulário sobreposto para adicionar instituição */}
            {showInstitutionForm && (
                <div className="fixed inset-0 bg-zinc-400/80 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
                        {/* Botão de fechar */}
                        <IconButton
                            onClick={toggleInstitutionForm}
                            className="absolute top-2 right-2"
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>

                        <h2 className="text-xl font-semibold mb-4 text-center text-purple-600">Adicionar Instituição</h2>

                        {/* Formulário para cadastro de instituição */}
                        <InstitutionForm />
                    </div>
                </div>
            )}

            {/* Formulário sobreposto para adicionar médico */}
            {showDoctorForm && (
                <div className="fixed inset-0 bg-zinc-400/80 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
                        {/* Botão de fechar */}
                        <IconButton
                            onClick={toggleDoctorForm}
                            className="absolute top-2 right-2"
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>

                        <h2 className="text-xl font-semibold mb-4 text-center text-purple-600">Adicionar Médico</h2>

                        {/* Formulário para cadastro de médico */}
                        <DoctorForm />
                    </div>
                </div>
            )}

            {/* Barra lateral com ações administrativas */}
            <aside className="w-1/5 bg-white p-5 shadow-md h-fit sticky top-24 self-start rounded-xl">
                <h1 className="text-lg font-semibold text-center mb-4">Painel do Administrador</h1>

                <nav className="flex flex-col gap-3">
                    {/* Botões de cadastro */}
                    <Button variant="contained" startIcon={<MedicalServicesIcon />} onClick={toggleDoctorForm}>
                        Cadastrar Profissional
                    </Button>

                    {/* Botão que alterna o formulário de instituição */}
                    <Button variant="contained" startIcon={<LocalHospitalIcon />} onClick={toggleInstitutionForm}>
                        Cadastrar Instituição
                    </Button>

                    <hr className="my-2" />

                    {/* Botões de acesso a dados */}
                    <Button variant="outlined" startIcon={<HotelIcon />}>
                        Ver Internações
                    </Button>

                    <Button variant="outlined" startIcon={<AssignmentIcon />}>
                        Gerar Relatórios
                    </Button>

                    <hr className="my-2" />

                    {/* Logout */}
                    <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Finalizar Sessão
                    </Button>
                </nav>
            </aside>

            {/* Conteúdo principal do painel */}
            <section className="w-4/5 px-8">
                {/* Campo de busca global */}
                <div className="mb-6">
                    <SearchInput placeholder="Buscar pacientes, médicos ou instituições..." />
                </div>

                {/* Painéis de dados principais */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Pacientes cadastrados */}
                    <PatientSection />

                    {/* Internações */}
                    <div className="bg-white h-auto p-4 rounded-xl shadow flex flex-col gap-1">
                        <div className="sticky top-0 bg-white z-10 pb-2">
                            <div className="flex items-center gap-2 text-green-600">
                                <HotelIcon />
                                <h2 className="text-md font-semibold">Internações Ativas</h2>
                            </div>
                            <p className="text-sm text-gray-500">Lista de internações será exibida aqui.</p>
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto relative">

                        </div>
                    </div>

                    {/* Médicos cadastrados */}
                    <DoctorSection />
                    
                    {/* Instituições cadastradas */}
                    <InstitutionSection />
                </div>
            </section>
        </main>
    );
}

export default Admin;