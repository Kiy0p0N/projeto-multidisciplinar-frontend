import { useState, useEffect } from 'react';
import axios from 'axios';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

function DoctorSection() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await axios.get("http://localhost:3000/doctors");
                setDoctors(response.data.doctors);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDoctor();
    }, []);

    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
            <div className="sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2 text-indigo-600">
                    <MedicalServicesIcon />
                    <h2 className="text-md font-semibold">Profissionais Ativos</h2>
                </div>
                <p className="text-sm text-gray-500">Lista de profissionais será exibida aqui.</p>
            </div>

            <div className="max-h-60 overflow-y-auto relative">
                {doctors && (
                    doctors.map((doctor) => (
                        <div key={doctor.id} className="flex justify-between items-center border-b border-gray-200 py-4 px-6 bg-white rounded shadow-sm">
                            {/* Conteúdo textual à esquerda */}
                            <div className='flex flex-col'>
                                <p className='text-base font-semibold text-gray-800'>{doctor.name}</p>
                                <p className='text-sm text-gray-500'>{doctor.specialty}</p>
                                <p className='text-sm text-gray-500'>{doctor.email}</p>
                            </div>

                            {/* Imagem à direita */}
                            <img 
                                src={`http://localhost:3000/${doctor.image_path.replace(/\\/g, "/")}`}
                                alt={`Imagem do médico ${doctor.name}`}
                                className="w-24 h-24 object-cover rounded-full shadow-md"    
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DoctorSection;