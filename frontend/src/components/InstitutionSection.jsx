import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { Button, IconButton } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import SearchInput from './input/SearchInput';
import { apiUrl } from '../utils/constants';

function InstitutionSection() {
    const [allInstitutions, setAllInstitutions] = useState([]); // Lista completa de instituições
    const [filteredInstitutions, setFilteredInstitutions] = useState([]); // Lista filtrada para exibição
    const [selectedInstitution, setSelectedInstitution] = useState(null); // Instituição atualmente selecionada
    const [searchQuery, setSearchQuery] = useState(''); // Termo atual da busca
    const [confirmDeleteForm, setConfirmDeleteForm] = useState(false); // Controle da exibição do modal de confirmação de deleção

    const location = useLocation(); // Hook que permite saber a rota atual (admin)

    /**
     * Efetua requisição à API para obter a lista de instituições cadastradas.
     * Executa assim que o componente é montado.
     */
    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await axios.get(`${apiUrl}/institutions`);
                setAllInstitutions(response.data.institutions);
                setFilteredInstitutions(response.data.institutions);
            } catch (error) {
                console.error('Erro ao buscar instituições:', error);
            }
        };

        fetchInstitutions();
    }, []);

    /**
     * Filtra a lista de instituições com base no texto inserido pelo usuário.
     * A busca é realizada considerando o nome, cidade ou ID.
     * 
     * @param {string} query - Texto digitado na barra de pesquisa
     */
    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        const filtered = allInstitutions.filter(
            (institution) =>
                institution.name.toLowerCase().includes(lowerQuery) ||
                institution.city.toLowerCase().includes(lowerQuery) ||
                institution.id.toString().includes(lowerQuery)
        );

        setFilteredInstitutions(filtered);
    };

    /**
     * Define a instituição selecionada para exibir seus detalhes no modal.
     * 
     * @param {object} institution - Objeto da instituição selecionada
     */
    const handleInstitutionClick = (institution) => {
        setSelectedInstitution(institution);
    };

    /**
     * Envia requisição DELETE para remover uma instituição do sistema.
     * Após a exclusão, atualiza a lista localmente e fecha o modal de confirmação.
     */
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${apiUrl}/institution/${selectedInstitution.id}`);

            if (response.status === 200) {
                const updatedInstitutions = allInstitutions.filter(i => i.id !== selectedInstitution.id);
                setAllInstitutions(updatedInstitutions);
                setFilteredInstitutions(updatedInstitutions);
                setSelectedInstitution(null);
                setConfirmDeleteForm(false);
            }
        } catch (error) {
            console.error('Erro ao deletar instituição:', error);
        }
    };

    /**
     * Fecha o modal de detalhes da instituição.
     */
    const closeModal = () => {
        setSelectedInstitution(null);
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
                <div className="flex items-center gap-2 text-purple-600">
                    <BusinessIcon />
                    <h2 className="text-md font-semibold">Instituições Cadastradas</h2>
                </div>
                <p className="text-sm text-gray-500">Lista de instituições cadastradas no sistema</p>
            </div>

            {/* Campo de busca */}
            <SearchInput
                placeholder="Pesquise por ID, nome ou cidade da instituição"
                onSearch={handleSearch}
            />

            {/* Lista de instituições */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                {filteredInstitutions.map((institution) => (
                    <div
                        key={institution.id}
                        onClick={() => handleInstitutionClick(institution)}
                        className="flex justify-between items-center py-3 px-4 hover:bg-purple-50 rounded cursor-pointer transition-all"
                    >
                        <div className="flex flex-col">
                            <p className="text-base font-semibold text-gray-800">{institution.name}</p>
                            <p className="text-sm text-gray-600">{institution.city} - {institution.state}</p>
                            <p className="text-sm text-gray-500">{institution.email}</p>
                        </div>

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

            {/* Modal de detalhes da instituição */}
            {selectedInstitution && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl w-full max-w-md relative">
                        <div className="w-full px-3 flex justify-end">
                            <IconButton onClick={closeModal}>
                                <CloseIcon />
                            </IconButton>
                        </div>

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

                        <div className="p-6 space-y-3 text-gray-800 text-sm">
                            <p><strong>ID:</strong> {selectedInstitution.id}</p>
                            <p><strong>Cidade:</strong> {selectedInstitution.city}</p>
                            <p><strong>Estado:</strong> {selectedInstitution.state}</p>
                            <p><strong>Email:</strong> {selectedInstitution.email}</p>
                            <p><strong>Telefone:</strong> {selectedInstitution.phone || 'Não informado'}</p>
                            <p><strong>Descrição:</strong> {selectedInstitution.description || 'Sem descrição disponível'}</p>

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
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmação de deleção */}
            {confirmDeleteForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="w-80 bg-white rounded-lg shadow-lg p-4">
                        <p className="text-sm">
                            Tem certeza que deseja deletar a instituição <strong>{selectedInstitution.name}</strong> do sistema? Esta ação não poderá ser desfeita.
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

export default InstitutionSection;
