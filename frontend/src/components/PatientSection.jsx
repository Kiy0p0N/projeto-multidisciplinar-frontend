import { useState, useEffect } from "react";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import axios from "axios";

function PatientSection() {
    const [patients, setPatients] = useState(null);

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
    }, []);

    return (
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
    );
}

export default PatientSection;