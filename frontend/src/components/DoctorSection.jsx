// Importações de hooks do React e bibliotecas auxiliares
import { useState, useEffect } from 'react';
import axios from 'axios';

// Ícones do Material UI
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SearchInput from './input/SearchInput';
import { IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import { useLocation } from 'react-router-dom'; // Hook para saber qual é a rota atual
import AppointmentForm from './form/AppointmentForm'; // Componente de agendamento

import { apiUrl } from '../utils/constants';

function DoctorSection({patient}) {
    // Estados para controle de dados e interações
    const [allDoctors, setAllDoctors] = useState([]); // Todos os médicos recebidos da API
    const [filteredDoctors, setFilteredDoctors] = useState([]); // Médicos filtrados pela busca
    const [selectedDoctor, setSelectedDoctor] = useState(null); // Médico selecionado para detalhes
    const [showAppointmentForm, setShowAppointmentForm] = useState(false); // Exibe ou esconde formulário
    const [searchQuery, setSearchQuery] = useState(''); // Texto da barra de pesquisa
    const [confirmDeleteForm, setConfirmDeleteForm] = useState(false);

    const location = useLocation(); // Localização atual (rota)

    // useEffect para buscar médicos da API assim que o componente monta
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${apiUrl}/doctors`);
                setAllDoctors(response.data.doctors); // Salva todos os médicos
                setFilteredDoctors(response.data.doctors); // Inicialmente, lista completa é mostrada
            } catch (error) {
                console.error(error);
            }
        };

        fetchDoctors(); // Executa função assíncrona
    }, []);

    // Função de busca que filtra médicos pelo nome, especialidade ou ID
    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        const filtered = allDoctors.filter((doctor) =>
            doctor.user_name.toLowerCase().includes(lowerQuery) ||
            doctor.specialty.toLowerCase().includes(lowerQuery) ||
            doctor.id.toString().includes(lowerQuery)
        );

        setFilteredDoctors(filtered);
    };

    // Quando o usuário clica em um médico da lista
    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
        setShowAppointmentForm(false); // Oculta formulário ao trocar de médico
    };

    // Função para o admin deletar um médico
    const handleDelete = async () => {
        try {
            const deleteDoctor = await axios.delete(`${apiUrl}/doctor/${selectedDoctor.id}`);

            if (deleteDoctor.status === 200) {
                window.location.reload(); // Força o refresh da página
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Fecha o modal de detalhes do médico
    const closeModal = () => {
        setSelectedDoctor(null);
    };

    // Exibe o formulário para confirmar a exclusão
    const showDeleteForm = () => {
        setConfirmDeleteForm(prev => !prev);
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
            {/* Cabeçalho da seção */}
            <div className="sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2 text-indigo-600">
                    <MedicalServicesIcon />
                    <h2 className="text-md font-semibold">Profissionais Ativos</h2>
                </div>
                <p className="text-sm text-gray-500">Lista de profissionais será exibida aqui.</p>
            </div>

            {/* Campo de busca */}
            <div className="mb-6">
                <SearchInput 
                    placeholder="Pesquise com o ID, nome ou especialidade do médico"
                    onSearch={handleSearch}
                />
            </div>

            {/* Lista de médicos (rolável) */}
            <div className="max-h-60 overflow-y-auto relative divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                    <div
                        key={doctor.id}
                        onClick={() => handleDoctorClick(doctor)}
                        className="flex justify-between items-center py-3 px-4 bg-white hover:bg-indigo-50 rounded cursor-pointer transition-all"
                    >
                        <div className="flex flex-col">
                            <p className="text-base font-semibold text-gray-800">{doctor.user_name}</p>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                            <p className="text-sm text-gray-500">{doctor.user_email}</p>
                        </div>

                        {/* Imagem do médico */}
                        <img 
                            src={`http://localhost:3000/${doctor.image_path.replace(/\\/g, "/")}`}
                            alt={`Imagem do médico ${doctor.name}`}
                            className="w-20 h-20 object-cover rounded-full shadow-md"
                        />
                    </div>
                ))}

                {/* Caso nenhum médico seja encontrado */}
                {filteredDoctors.length === 0 && (
                    <p className="text-center text-sm text-gray-400 mt-2">Nenhum médico encontrado.</p>
                )}
            </div>

            {/* Modal com os detalhes do médico selecionado */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                        
                        {/* Botão de fechar no canto superior direito */}
                        <div className='w-full px-3 flex justify-end'>
                            <IconButton onClick={closeModal}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {/* Cabeçalho com imagem e nome */}
                        <div className="flex flex-col items-center bg-indigo-600 pb-6 pt-10 relative">
                            <img
                                src={`http://localhost:3000/${selectedDoctor.image_path.replace(/\\/g, "/")}`}
                                alt={`Imagem do médico ${selectedDoctor.name}`}
                                className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg z-10"
                            />
                            <h2 className="text-white text-lg font-semibold mt-3">{selectedDoctor.user_name}</h2>
                            <p className="text-indigo-100 text-sm">{selectedDoctor.specialty}</p>
                        </div>

                        {/* Detalhes do médico */}
                        <div className="p-6 space-y-3 text-gray-800 text-sm">
                            <p><strong>ID:</strong> {selectedDoctor.id}</p>
                            <p><strong>Email:</strong> {selectedDoctor.user_email}</p>
                            <p><strong>Telefone:</strong> {selectedDoctor.doctor_phone || 'Não informado'}</p>
                            <p><strong>Registro:</strong> {selectedDoctor.registration || 'Não informado'}</p>
                            <p><strong>Instituição:</strong> {selectedDoctor.institution_name || 'Não vinculada'}</p>
                            <p><strong>Biografia:</strong> {selectedDoctor.bio || 'Sem informações adicionais.'}</p>

                            {/* Botão de deletar visível apenas no painel do admin */}
                            {location.pathname === '/admin' && (
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    startIcon={<DeleteIcon />}
                                    onClick={showDeleteForm}
                                >
                                    Deletar
                                </Button>
                            )}

                            {/* Botão de agendar visível apenas no painel do paciente */}
                            {location.pathname === '/patient' && (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                                >
                                    Agendar Consulta
                                </Button>
                            )}

                            {/* Formulário de agendamento (visível ao clicar em Agendar) */}
                            {showAppointmentForm && (
                                <div className="mt-4">
                                    <AppointmentForm 
                                        doctor={selectedDoctor}
                                        patient_id={patient.id}
                                        onClose={() => setShowAppointmentForm(false)} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {confirmDeleteForm && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='w-80 h-auto absolute top-1/3 flex flex-col gap-3 bg-white shadow-lg rounded-lg p-3 z-50'>
                        <p>Tem certeza que quer deletar o médico <strong>{selectedDoctor.user_name}</strong> do sistema? Essa ação não poderá ser desfeita</p>
                        
                        <hr />

                        <div className='flex gap-2'>
                            <Button variant='contained' color='success' onClick={handleDelete}>
                                sim
                            </Button>

                            <Button variant='contained' color='error' onClick={showDeleteForm}>
                                não
                            </Button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorSection;
