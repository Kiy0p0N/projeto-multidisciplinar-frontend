import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { IconButton, Button } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import SearchInput from './input/SearchInput';
import AppointmentForm from './form/AppointmentForm';

import { apiUrl } from '../utils/constants';

function DoctorSection({ patient }) {
    const [allDoctors, setAllDoctors] = useState([]); // Lista completa de médicos
    const [filteredDoctors, setFilteredDoctors] = useState([]); // Lista filtrada para exibição
    const [selectedDoctor, setSelectedDoctor] = useState(null); // Médico atualmente selecionado
    const [showAppointmentForm, setShowAppointmentForm] = useState(false); // Controle da exibição do form de agendamento
    const [searchQuery, setSearchQuery] = useState(''); // Termo atual da busca
    const [confirmDeleteForm, setConfirmDeleteForm] = useState(false); // Controle da exibição do modal de confirmação de deleção

    const location = useLocation(); // Hook que permite saber a rota atual (admin ou patient)

    /**
     * Efetua requisição à API para obter a lista de médicos disponíveis.
     * Executa assim que o componente é montado.
     */
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${apiUrl}/doctors`);
                setAllDoctors(response.data.doctors);
                setFilteredDoctors(response.data.doctors);
            } catch (error) {
                console.error('Erro ao buscar médicos:', error);
            }
        };

        fetchDoctors();
    }, []);

    /**
     * Filtra a lista de médicos com base no texto inserido pelo usuário.
     * A busca é realizada considerando o nome, especialidade ou ID.
     * 
     * @param {string} query - Texto digitado na barra de pesquisa
     */
    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        const filtered = allDoctors.filter(
            (doctor) =>
                doctor.user_name.toLowerCase().includes(lowerQuery) ||
                doctor.specialty.toLowerCase().includes(lowerQuery) ||
                doctor.id.toString().includes(lowerQuery)
        );

        setFilteredDoctors(filtered);
    };

    /**
     * Quando um médico é selecionado na lista,
     * define-o como médico atual para exibir detalhes no modal.
     * 
     * @param {object} doctor - Objeto do médico selecionado
     */
    const handleDoctorClick = (doctor) => {
        console.log(doctor)
        setSelectedDoctor(doctor);
        setShowAppointmentForm(false); // Garante que o form de agendamento esteja fechado ao trocar de médico
    };

    /**
     * Envia requisição DELETE para remover um médico do sistema.
     * Após a exclusão, atualiza a lista localmente e fecha o modal de confirmação.
     */
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${apiUrl}/doctor/${selectedDoctor.id}`);

            if (response.status === 200) {
                const updatedDoctors = allDoctors.filter(d => d.id !== selectedDoctor.id);
                setAllDoctors(updatedDoctors);
                setFilteredDoctors(updatedDoctors);
                setSelectedDoctor(null);
                setConfirmDeleteForm(false);
            }
        } catch (error) {
            console.error('Erro ao deletar médico:', error);
        }
    };

    /**
     * Fecha o modal de detalhes e o formulário de agendamento (se aberto).
     */
    const closeModal = () => {
        setSelectedDoctor(null);
        setShowAppointmentForm(false);
    };

    /**
     * Alterna a visibilidade do modal de confirmação de deleção.
     */
    const toggleDeleteForm = () => {
        setConfirmDeleteForm(prev => !prev);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-2">
            {/* Cabeçalho da seção */}
            <div className="sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2 text-indigo-600">
                    <MedicalServicesIcon />
                    <h2 className="text-md font-semibold">Profissionais Ativos</h2>
                </div>
                <p className="text-sm text-gray-500">Lista de profissionais cadastrados no sistema</p>
            </div>

            {/* Campo de busca */}
            <SearchInput
                placeholder="Pesquise por ID, nome ou especialidade"
                onSearch={handleSearch}
            />

            {/* Lista de médicos */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                    <div
                        key={doctor.id}
                        onClick={() => handleDoctorClick(doctor)}
                        className="flex justify-between items-center py-3 px-4 hover:bg-indigo-50 rounded cursor-pointer transition-all"
                    >
                        <div className="flex flex-col">
                            <p className="text-base font-semibold text-gray-800">{doctor.user_name}</p>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                            <p className="text-sm text-gray-500">{doctor.user_email}</p>
                        </div>

                        <img
                            src={`http://localhost:3000/${doctor.image_path.replace(/\\/g, "/")}`}
                            alt={`Imagem do médico ${doctor.user_name}`}
                            className="w-20 h-20 object-cover rounded-full shadow-md"
                        />
                    </div>
                ))}

                {filteredDoctors.length === 0 && (
                    <p className="text-center text-sm text-gray-400 mt-2">Nenhum médico encontrado.</p>
                )}
            </div>

            {/* Modal de detalhes do médico */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl w-full max-w-md relative">
                        <div className="w-full px-3 flex justify-end">
                            <IconButton onClick={closeModal}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <div className="flex flex-col items-center bg-indigo-600 pb-6 pt-10">
                            <img
                                src={`http://localhost:3000/${selectedDoctor.image_path.replace(/\\/g, "/")}`}
                                alt={`Imagem do médico ${selectedDoctor.user_name}`}
                                className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg"
                            />
                            <h2 className="text-white text-lg font-semibold mt-3">{selectedDoctor.user_name}</h2>
                            <p className="text-indigo-100 text-sm">{selectedDoctor.specialty}</p>
                        </div>

                        <div className="p-6 space-y-3 text-gray-800 text-sm">
                            <p><strong>ID:</strong> {selectedDoctor.id}</p>
                            <p><strong>Email:</strong> {selectedDoctor.user_email}</p>
                            <p><strong>Telefone:</strong> {selectedDoctor.doctor_phone || 'Não informado'}</p>
                            <p><strong>Registro:</strong> {selectedDoctor.registration || 'Não informado'}</p>
                            <p><strong>Instituição:</strong> {selectedDoctor.institution_name || 'Não vinculada'}</p>
                            <p><strong>Biografia:</strong> {selectedDoctor.bio || 'Sem informações adicionais.'}</p>

                            {/* Visível apenas para o admin */}
                            {location.pathname === '/admin' && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={toggleDeleteForm}
                                >
                                    Deletar
                                </Button>
                            )}

                            {/* Visível apenas para o paciente */}
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

                            {/* Formulário de agendamento */}
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

            {/* Modal de confirmação de deleção */}
            {confirmDeleteForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="w-80 bg-white rounded-lg shadow-lg p-4">
                        <p className="text-sm">
                            Tem certeza que deseja deletar o médico <strong>{selectedDoctor.user_name}</strong> do sistema? Esta ação não poderá ser desfeita.
                        </p>

                        <div className="flex gap-2 mt-4 justify-end">
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                Deletar
                            </Button>
                            <Button variant="contained" color="inherit" onClick={toggleDeleteForm}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorSection;
