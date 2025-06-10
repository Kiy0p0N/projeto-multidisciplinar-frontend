import { useState, useEffect } from 'react';
import axios from 'axios';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SearchInput from './input/SearchInput';
import { IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from 'react-router-dom';

function DoctorSection() {
    const [allDoctors, setAllDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const location = useLocation();

    // Buscar todos os médicos na montagem do componente
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get("http://localhost:3000/doctors");
                setAllDoctors(response.data.doctors);
                setFilteredDoctors(response.data.doctors);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDoctors();
    }, []);

    // Filtrar médicos com base na busca
    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        const filtered = allDoctors.filter((doctor) =>
            doctor.name.toLowerCase().includes(lowerQuery) ||
            doctor.specialty.toLowerCase().includes(lowerQuery) ||
            doctor.id.toString().includes(lowerQuery)
        );

        setFilteredDoctors(filtered);
    };

    // Abrir modal com detalhes do médico
    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
    };

    // Fechar modal
    const closeModal = () => {
        setSelectedDoctor(null);
    };

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

            {/* Lista de médicos */}
            <div className="max-h-60 overflow-y-auto relative divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                    <div
                        key={doctor.id}
                        onClick={() => handleDoctorClick(doctor)}
                        className="flex justify-between items-center py-3 px-4 bg-white hover:bg-indigo-50 rounded cursor-pointer transition-all"
                    >
                        {/* Dados textuais do médico */}
                        <div className="flex flex-col">
                            <p className="text-base font-semibold text-gray-800">{doctor.user_name}</p>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                            <p className="text-sm text-gray-500">{doctor.user_email}</p>
                        </div>

                        {/* Foto do médico */}
                        <img 
                            src={`http://localhost:3000/${doctor.image_path.replace(/\\/g, "/")}`}
                            alt={`Imagem do médico ${doctor.name}`}
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
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                        {/* Botão de fechar */}
                        <div className='w-full px-3 flex justify-end'>
                            <IconButton
                                onClick={closeModal}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {/* Foto de perfil grande */}
                        <div className="flex flex-col items-center bg-indigo-600 pb-6 pt-10 relative">
                            <img
                                src={`http://localhost:3000/${selectedDoctor.image_path.replace(/\\/g, "/")}`}
                                alt={`Imagem do médico ${selectedDoctor.name}`}
                                className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg z-10"
                            />
                            <h2 className="text-white text-lg font-semibold mt-3">{selectedDoctor.user_name}</h2>
                            <p className="text-indigo-100 text-sm">{selectedDoctor.specialty}</p>
                        </div>

                        {/* Informações detalhadas */}
                        <div className="p-6 space-y-3 text-gray-800 text-sm">
                            <p><strong>ID:</strong> {selectedDoctor.id}</p>
                            <p><strong>Email:</strong> {selectedDoctor.user_email}</p>
                            <p><strong>Telefone:</strong> {selectedDoctor.doctor_phone || 'Não informado'}</p>
                            <p><strong>Registro:</strong> {selectedDoctor.registration || 'Não informado'}</p>
                            <p><strong>Instituição:</strong> {selectedDoctor.institution_name || 'Não vinculada'}</p>
                            <p><strong>Biografia:</strong> {selectedDoctor.bio || 'Sem informações adicionais.'}</p>

                            {/* Botão para o admin deletar o médico */}
                            {location.pathname === '/admin' && (
                                <Button variant="contained" color="error" startIcon={<DeleteIcon />}>Deletar</Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorSection;
