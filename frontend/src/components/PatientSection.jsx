import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

import SearchInput from "./input/SearchInput";
import { apiUrl } from "../utils/constants";

function PatientSection() {
    const [allPatients, setAllPatients] = useState([]); // Lista completa de pacientes
    const [filteredPatients, setFilteredPatients] = useState([]); // Lista filtrada com base na busca
    const [selectedPatient, setSelectedPatient] = useState(null); // Paciente selecionado para o modal
    const [searchQuery, setSearchQuery] = useState(''); // Termo atual da busca

    /**
     * Efetua requisição para obter todos os pacientes cadastrados no sistema.
     * Executa na montagem inicial do componente.
     */
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${apiUrl}/patients`);
                setAllPatients(response.data.patients);
                setFilteredPatients(response.data.patients);
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            }
        };

        fetchPatients();
    }, []);

    /**
     * Filtra pacientes com base no texto digitado.
     * Busca realizada no nome, email ou ID.
     * 
     * @param {string} query - Texto digitado no campo de busca
     */
    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        const filtered = allPatients.filter(
            (patient) =>
                patient.name.toLowerCase().includes(lowerQuery) ||
                patient.email.toLowerCase().includes(lowerQuery) ||
                patient.id.toString().includes(lowerQuery)
        );

        setFilteredPatients(filtered);
    };

    /**
     * Define o paciente selecionado, exibindo o modal com detalhes.
     * 
     * @param {object} patient - Objeto do paciente selecionado
     */
    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
    };

    /**
     * Fecha o modal de detalhes do paciente.
     */
    const closeModal = () => {
        setSelectedPatient(null);
    };

    return (
        <div className="bg-white h-auto p-4 rounded-xl shadow flex flex-col gap-2">
            {/* Cabeçalho da seção */}
            <div className="sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2 text-blue-600">
                    <PeopleAltIcon />
                    <h2 className="text-md font-semibold">Pacientes</h2>
                </div>
                <p className="text-sm text-gray-500">Lista de pacientes cadastrados</p>
            </div>

            {/* Campo de busca */}
            <div className="mb-4">
                <SearchInput
                    placeholder="Pesquise por ID, nome ou e-mail do paciente"
                    onSearch={handleSearch}
                />
            </div>

            {/* Lista de pacientes */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                    <div
                        key={patient.id}
                        onClick={() => handlePatientClick(patient)}
                        className="py-2 px-2 cursor-pointer hover:bg-blue-50 rounded transition-all"
                    >
                        <p className="text-sm font-medium text-gray-800">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                ))}

                {filteredPatients.length === 0 && (
                    <p className="text-center text-sm text-gray-400 mt-2">
                        Nenhum paciente encontrado.
                    </p>
                )}
            </div>

            {/* Modal de detalhes do paciente */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
                        {/* Botão de fechar */}
                        <div className="w-full px-3 flex justify-end">
                            <IconButton onClick={closeModal}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {/* Conteúdo do modal */}
                        <div className="px-6 pb-6">
                            <h2 className="text-lg font-semibold text-blue-700 mb-4">
                                Detalhes do Paciente
                            </h2>

                            <div className="text-sm text-gray-800 space-y-2">
                                <p><strong>ID:</strong> {selectedPatient.id}</p>
                                <p><strong>Nome:</strong> {selectedPatient.name}</p>
                                <p><strong>Email:</strong> {selectedPatient.email}</p>
                                <p><strong>Telefone:</strong> {selectedPatient.phone || "Não informado"}</p>
                                <p><strong>Data de Nascimento:</strong> {selectedPatient.birth_date
                                    ? new Date(selectedPatient.birth_date).toLocaleDateString("pt-BR")
                                    : "Não informado"}
                                </p>
                                <p><strong>Gênero:</strong> {selectedPatient.gender || "Não informado"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientSection;
