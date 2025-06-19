import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { IconButton, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { apiUrl } from '../utils/constants';

function AppointmentSection({ user }) {
    const [appointments, setAppointments] = useState([]); // Lista de agendamentos do usuário
    const [selectedAppointment, setSelectedAppointment] = useState(null); // Agendamento selecionado para exibir detalhes
    const [confirmDeleteForm, setConfirmDeleteForm] = useState(false); // Controle do modal de confirmação de cancelamento

    const location = useLocation(); // Identifica qual é a rota atual

    /**
     * Efeito responsável por buscar todos os agendamentos do usuário (seja paciente ou médico)
     * Executa assim que o componente é montado ou quando o usuário muda
     */
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/appointments/user/${user.id}`);
                if (response.status === 200) {
                    setAppointments(response.data.appointments);
                }
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };

        if (user) fetchAppointments();
    }, [user]);

    /**
     * Formata uma data recebida em formato string para o padrão pt-BR (dd/mm/aaaa)
     * 
     * @param {string} dateString - Data no formato ISO
     * @returns {string} - Data formatada no padrão brasileiro
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    /**
     * Cancela (deleta) um agendamento específico do backend
     * 
     * @param {number} appointmentId - ID do agendamento que será cancelado
     */
    const handleCancel = async (appointmentId) => {
        try {
            const response = await axios.delete(`${apiUrl}/appointments/${appointmentId}`);
            if (response.status === 200) {
                // Remove o agendamento da lista local após exclusão bem-sucedida
                setAppointments(prev => prev.filter(a => a.id !== appointmentId));
                setSelectedAppointment(null);
                setConfirmDeleteForm(false);
            }
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
        }
    };

    /**
     * Alterna a exibição do modal de confirmação de cancelamento
     */
    const showDeleteForm = () => {
        setConfirmDeleteForm(prev => !prev);
    };

    /**
     * Fecha o modal de detalhes do agendamento selecionado
     */
    const closeModal = () => {
        setSelectedAppointment(null);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
            {/* Cabeçalho da seção */}
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
                                    {/* Mostra o nome do médico se for paciente, ou do paciente se for médico */}
                                    {location.pathname === '/patient' ? appointment.doctor_name : appointment.patient_name}
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

            {/* Modal de detalhes do agendamento */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                        
                        {/* Botão para fechar o modal */}
                        <div className='w-full px-3 flex justify-end'>
                            <IconButton onClick={closeModal}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {/* Cabeçalho do modal */}
                        <div className="flex flex-col items-center bg-indigo-600 pb-6 pt-10 relative">
                            <CalendarMonthIcon className="text-white" fontSize="large" />
                            <h2 className="text-white text-lg font-semibold mt-3">
                                {location.pathname === '/patient' ? selectedAppointment.doctor_name : selectedAppointment.patient_name}
                            </h2>
                            <p className="text-indigo-100 text-sm">
                                {selectedAppointment.institution_name}
                            </p>
                        </div>

                        {/* Informações detalhadas do agendamento */}
                        <div className="p-6 space-y-3 text-gray-800 text-sm">
                            <p><strong>Data:</strong> {formatDate(selectedAppointment.appointment_date)}</p>
                            <p><strong>Horário:</strong> {selectedAppointment.appointment_time}</p>
                            {location.pathname === '/patient' ? (
                                <p><strong>Médico:</strong> {selectedAppointment.doctor_name}</p>
                            ) : (
                                <p><strong>Paciente:</strong> {selectedAppointment.patient_name}</p>
                            )}
                            <p><strong>Instituição:</strong> {selectedAppointment.institution_name}</p>

                            {/* Botão de cancelar */}
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

            {/* Modal de confirmação para cancelar */}
            {confirmDeleteForm && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='w-80 h-auto absolute top-1/3 flex flex-col gap-3 bg-white shadow-lg rounded-lg p-3 z-50'>
                        <p>
                            Tem certeza que quer cancelar o agendamento com 
                            <strong> {selectedAppointment.doctor_name}</strong>?
                        </p>
                        
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
