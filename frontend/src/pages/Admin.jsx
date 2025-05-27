import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@mui/material";

// Ícones do Material UI
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HotelIcon from '@mui/icons-material/Hotel';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessIcon from '@mui/icons-material/Business';
import SearchInput from "../components/input/SearchInput";

function Admin() {
    const [admin, setAdmin] = useState(null);
    const [patients, setPatients] = useState(null);
    const navigate = useNavigate();

    // Verifica a sessão e obtém dados do admin
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get("http://localhost:3000/user", {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setAdmin(response.data.user);
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                navigate('/login');
            }
        };

        fetchAdmin();
    }, [navigate]);

    // Pega todos os pacientes
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:3000/patients");
                setPatients(response.data.patients);
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            }
        }

        fetchPatients()
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

    // Enquanto admin não é carregado, não renderiza
    if (!admin) return null;

    return (
        <main className="w-full min-h-dvh flex py-24 bg-gray-100">
            {/* Barra lateral com ações administrativas */}
            <aside className="w-1/5 bg-white p-5 shadow-md h-fit sticky top-24 self-start rounded-xl">
                <h1 className="text-lg font-semibold text-center mb-4">Painel do Administrador</h1>

                <nav className="flex flex-col gap-3">
                    {/* Botões de cadastro */}
                    <Button variant="contained" startIcon={<PersonAddIcon />}>
                        Cadastrar Paciente
                    </Button>

                    <Button variant="contained" startIcon={<MedicalServicesIcon />}>
                        Cadastrar Profissional
                    </Button>

                    <Button variant="contained" startIcon={<LocalHospitalIcon />}>
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
                    <div className="bg-white h-auto p-4 rounded-xl shadow flex flex-col gap-1">
                        {/* Cabeçalho fixo */}
                        <div className="sticky top-0 bg-white z-10 pb-2">
                            <div className="flex items-center gap-2 text-blue-600">
                            <PeopleAltIcon />
                            <h2 className="text-md font-semibold">Pacientes Recentes</h2>
                            </div>
                            <p className="text-sm text-gray-500">Lista de pacientes cadastrados</p>
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto relative">
                            {patients && (
                                patients.map((patient) => (
                                    <div key={patient.id} className="border-b border-gray-200 py-2">
                                        <p className="text-sm font-medium text-gray-800">{patient.name}</p>
                                        <p className="text-sm text-gray-500">{patient.email}</p>
                                        <p className="text-xs text-gray-400">
                                        Cadastrado em: {new Date(patient.created_at).toLocaleDateString("pt-BR")}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                        
                    </div>

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
                    <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
                        <div className="sticky top-0 bg-white z-10 pb-2">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <MedicalServicesIcon />
                                <h2 className="text-md font-semibold">Profissionais Ativos</h2>
                            </div>
                            <p className="text-sm text-gray-500">Lista de profissionais será exibida aqui.</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto relative">

                        </div>
                    </div>
                    
                    {/* Instituições cadastradas */}
                    <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
                        <div className="sticky top-0 bg-white z-10 pb-2">
                            <div className="flex items-center gap-2 text-purple-600">
                                <BusinessIcon />
                                <h2 className="text-md font-semibold">Instituições Cadastradas</h2>
                            </div>
                            <p className="text-sm text-gray-500">Lista de instituições será exibida aqui.</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto relative">

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Admin;
