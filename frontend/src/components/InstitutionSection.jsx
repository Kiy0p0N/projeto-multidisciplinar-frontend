import { useState, useEffect } from 'react';
import axios from 'axios';
import BusinessIcon from '@mui/icons-material/Business';
import SearchInput from './input/SearchInput';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from 'react-router-dom';
import { apiUrl } from '../utils/constants';

function InstitutionSection() {
    const [allInstitutions, setAllInstitutions] = useState([]);
    const [filteredInstitutions, setFilteredInstitutions] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDeleteForm, setConfirmDeleteForm] = useState(false);

    const location = useLocation();

    // Buscar todas as instituições na montagem do componente
    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await axios.get(`${apiUrl}/institutions`);
                setAllInstitutions(response.data.institutions);
                setFilteredInstitutions(response.data.institutions);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInstitutions();
    }, []);

    // Filtrar instituições conforme o texto digitado
    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        const filtered = allInstitutions.filter((institution) =>
            institution.name.toLowerCase().includes(lowerQuery) ||
            institution.city.toLowerCase().includes(lowerQuery) ||
            institution.id.toString().includes(lowerQuery)
        );

        setFilteredInstitutions(filtered);
    };

    // Abrir modal de detalhes da instituição
    const handleInstitutionClick = (institution) => {
        setSelectedInstitution(institution);
    };

    // Função para o admin deletar uma instituição
    const handleDelete = async () => {
        try {
            const deleteDoctor = await axios.delete(`${apiUrl}/institution/${selectedInstitution.id}`);

            if (deleteDoctor.status === 200) {
                window.location.reload(); // Força o refresh da página
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Fechar modal
    const closeModal = () => {
        setSelectedInstitution(null);
    };

    // Exibe o formulário para confirmar a exclusão
    const showDeleteForm = () => {
        setConfirmDeleteForm(prev => !prev);
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
            {/* Cabeçalho */}
            <div className="sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2 text-purple-600">
                    <BusinessIcon />
                    <h2 className="text-md font-semibold">Instituições Cadastradas</h2>
                </div>
                <p className="text-sm text-gray-500">Lista de instituições será exibida aqui.</p>
            </div>

            {/* Campo de busca */}
            <SearchInput
                placeholder="Pesquise com o ID, nome ou cidade da instituição"
                onSearch={handleSearch}
            />

            {/* Lista de instituições */}
            <div className="max-h-60 overflow-y-auto relative divide-y divide-gray-200">
                {filteredInstitutions.map((institution) => (
                    <div
                        key={institution.id}
                        onClick={() => handleInstitutionClick(institution)}
                        className="flex justify-between items-center py-3 px-4 bg-white hover:bg-purple-50 rounded cursor-pointer transition-all"
                    >
                        {/* Informações textuais */}
                        <div className="flex flex-col">
                            <p className="text-base font-semibold text-gray-800">{institution.name}</p>
                            <p className="text-sm text-gray-600">{institution.city} - {institution.state}</p>
                            <p className="text-sm text-gray-500">{institution.email}</p>
                        </div>

                        {/* Imagem da instituição */}
                        <img
                            src={`http://localhost:3000/${institution.image_path.replace(/\\/g, "/")}`}
                            alt={`Imagem da instituição ${institution.name}`}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                    </div>
                ))}
                {filteredInstitutions.length === 0 && (
                    <p className="text-center text-sm text-gray-400 mt-2">Nenhuma instituição encontrada.</p>
                )}
            </div>

            {/* Modal com detalhes da instituição */}
            {selectedInstitution && (
                <div className="fixed inset-0 bg-zinc-700/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
                        {/* Botão de fechar */}
                        <div className='w-full px-3 flex justify-end'>
                            <IconButton
                                onClick={closeModal}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {/* Imagem de capa */}
                        <div
                            className="h-48 bg-cover bg-center relative"
                            style={{
                                backgroundImage: `url(http://localhost:3000/${selectedInstitution.image_path.replace(/\\/g, "/")})`
                            }}
                        >
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <h2 className="text-xl font-bold text-white text-center px-4">
                                    {selectedInstitution.name}
                                </h2>
                            </div>
                        </div>

                        {/* Informações da instituição */}
                        <div className="p-6 space-y-3 text-gray-800 text-sm">
                            <p><strong>ID:</strong> {selectedInstitution.id}</p>
                            <p><strong>Cidade:</strong> {selectedInstitution.city}</p>
                            <p><strong>Estado:</strong> {selectedInstitution.state}</p>
                            <p><strong>Email:</strong> {selectedInstitution.email}</p>
                            <p><strong>Telefone:</strong> {selectedInstitution.phone || 'Não informado'}</p>
                            <p><strong>Descrição:</strong> {selectedInstitution.description || 'Sem descrição disponível'}</p>

                            {/* Botão para o admin deletar a instituição */}
                            {location.pathname === '/admin' && (
                                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={showDeleteForm}>Deletar</Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {confirmDeleteForm && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='w-80 h-auto absolute top-1/3 flex flex-col gap-3 bg-white shadow-lg rounded-lg p-3 z-50'>
                        <p>Tem certeza que quer deletar a instituição <strong>{selectedInstitution.name}</strong> do sistema? Essa ação não poderá ser desfeita</p>
                        
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

export default InstitutionSection;
