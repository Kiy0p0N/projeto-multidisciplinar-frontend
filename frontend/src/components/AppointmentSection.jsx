import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../utils/constants';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';

import { IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function AppointmentSection({ patient }) {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [confirmDeleteForm, setConfirmDeleteForm] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/appointments/patient/${patient.id}`);
                if (response.status === 200) {
                    setAppointments(response.data.appointments);
                }
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
                setError('Erro ao carregar agendamentos.');
            }
        };

        if (patient) fetchAppointments();
    }, [patient]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const handleCancel = async (appointmentId) => {
        try {
            const response = await axios.delete(`${apiUrl}/appointments/${appointmentId}`);
            if (response.status === 200) {
                setAppointments(prev => prev.filter(a => a.id !== appointmentId));
                setSelectedAppointment(null);
            }
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
        }
    };

    const showDeleteForm = () => {
        setConfirmDeleteForm(prev => !prev);
    };

    const closeModal = () => {
        setSelectedAppointment(null);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
            {/* Cabeçalho */}
            <div className="sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2 text-indigo-600">
                    <CalendarMonthIcon />
                    <h2 className="text-md font-semibold">Seus Agendamentos</h2>
                </div>
                <p className="text-sm text-gray-500">Lista dos seus agendamentos ativos.</p>
            </div>

            {/* Lista de agendamentos */}
            <div className="max-h-60 overflow-y-auto relative divide-y divide-gray-200">
                {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            onClick={() => setSelectedAppointment(appointment)}
                            className="flex justify-between items-center py-3 px-4 bg-white hover:bg-indigo-50 rounded cursor-pointer transition-all"
                        >
                            <div className="flex flex-col">
                                <p className="text-base font-semibold text-gray-800">
                                    {appointment.doctor_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {appointment.institution_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatDate(appointment.appointment_date)} - {appointment.appointment_time}
                                </p>
                            </div>

                            <CalendarMonthIcon className="text-indigo-500" />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-400 mt-2">
                        Nenhum agendamento encontrado.
                    </p>
                )}
                </div>

            {/* Modal de detalhes */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                        
                        {/* Botão fechar */}
                        <div className='w-full px-3 flex justify-end'>
                            <IconButton onClick={closeModal}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {/* Cabeçalho */}
                        <div className="flex flex-col items-center bg-indigo-600 pb-6 pt-10 relative">
                            <CalendarMonthIcon className="text-white" fontSize="large" />
                            <h2 className="text-white text-lg font-semibold mt-3">
                                {selectedAppointment.doctor_name}
                            </h2>
                            <p className="text-indigo-100 text-sm">
                                {selectedAppointment.institution_name}
                            </p>
                        </div>

                        {/* Detalhes */}
                        <div className="p-6 space-y-3 text-gray-800 text-sm">
                            <p><strong>Data:</strong> {formatDate(selectedAppointment.appointment_date)}</p>
                            <p><strong>Horário:</strong> {selectedAppointment.appointment_time}</p>
                            <p><strong>Médico:</strong> {selectedAppointment.doctor_name}</p>
                            <p><strong>Instituição:</strong> {selectedAppointment.institution_name}</p>

                            <Button 
                                variant="contained" 
                                color="error" 
                                fullWidth 
                                startIcon={<DeleteIcon />}
                                onClick={showDeleteForm}
                            >
                                Cancelar Agendamento
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmar cancelamento */}
            {confirmDeleteForm && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='w-80 h-auto absolute top-1/3 flex flex-col gap-3 bg-white shadow-lg rounded-lg p-3 z-50'>
                        <p>Tem certeza que quer cancelar o agendamento com <strong>{selectedAppointment.doctor_name}</strong>?</p>
                        
                        <hr />

                        <div className='flex gap-2'>
                            <Button 
                                variant='contained' 
                                color='success' 
                                onClick={() => handleCancel(selectedAppointment.id)}
                            >
                                Sim
                            </Button>

                            <Button 
                                variant='contained' 
                                color='error' 
                                onClick={showDeleteForm}
                            >
                                Não
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppointmentSection;
