import { useState, useEffect } from 'react';
import axios from 'axios';
import BusinessIcon from '@mui/icons-material/Business';

function InstitutionSection() {
    const [institutions, setInstitutions] = useState([]);

    useEffect(() => {
        const fetchInstitution = async () => {
            try {
                const response = await axios.get("http://localhost:3000/institutions");
                setInstitutions(response.data.institutions);
            } catch (error) {
                console.error(error);
            }
        }

        fetchInstitution();
    }, []);

    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
            <div className="sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2 text-purple-600">
                    <BusinessIcon />
                    <h2 className="text-md font-semibold">Instituições Cadastradas</h2>
                </div>
                <p className="text-sm text-gray-500">Lista de instituições será exibida aqui.</p>
            </div>
            <div className="max-h-60 overflow-y-auto relative">
                {institutions && (
                    institutions.map((institution) => (
                        <div
                            key={institution.id}
                            className="flex justify-between items-center border-b border-gray-200 py-4 px-6 bg-white rounded shadow-sm"
                        >
                            {/* Conteúdo textual à esquerda */}
                            <div className="flex flex-col">
                                <p className="text-base font-semibold text-gray-800">{institution.name}</p>
                                <p className="text-sm text-gray-600">{institution.city} - {institution.state}</p>
                                <p className="text-sm text-gray-500">{institution.email}</p>
                            </div>

                            {/* Imagem à direita */}
                            <img
                                src={`http://localhost:3000/${institution.image_path.replace(/\\/g, "/")}`}
                                alt={`Imagem da instituição ${institution.name}`}
                                className="w-24 h-24 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default InstitutionSection;