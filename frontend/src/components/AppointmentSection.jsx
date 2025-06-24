import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { IconButton, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Brightness1Icon from '@mui/icons-material/Brightness1';

import { apiUrl, statusColor } from '../utils/constants';
import SearchInput from '../components/input/SearchInput';

function AppointmentSection({ user }) {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [confirmDeleteForm, setConfirmDeleteForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Efeito responsável por buscar os agendamentos do usuário
     * no momento da montagem do componente ou quando o usuário for alterado.
     */
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/appointments/user/${user.id}`);
                setAppointments(response.data.appointments);
                setFilteredAppointments(response.data.appointments);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };

        if (user) fetchAppointments();
    }, [user]);

    /**
     * Efeito responsável por verificar os agendamentos que estão no horário atual.
     * Caso o horário e a data coincidam com o horário atual do sistema,
     * o status do agendamento é alterado de 'agendado' para 'disponivel'.
     */
    useEffect(() => {
        const checkAndUpdateAppointments = () => {
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0]; // Extrai data no formato '2025-06-20'
            const currentTime = now.toTimeString().slice(0, 5); // Extrai horário no formato 'HH:MM'

            appointments.map(async (appointment) => {
                const appointmentDate = new Date(appointment.appointment_date).toISOString().split('T')[0];

                if (currentDate === appointmentDate) {
                    const appointmentTime = appointment.appointment_time.slice(0, 5);

                    // Monta uma string completa no formato ISO
                    const appointmentDateTimeString = `${appointmentDate}T${appointment.appointment_time}`;

                    // Cria o objeto Date para o horário do agendamento
                    const appointmentDateTime = new Date(appointmentDateTimeString);

                    // Cria um novo Date adicionando 30 minutos ao horário do agendamento
                    const appointmentEndTime = new Date(appointmentDateTime.getTime() + 30 * 60000).toTimeString().slice(0, 5);
                    
                    // Se o horário atual for maior ou igual ao horário agendado e for menor ou igual ao horário final da consulta 
                    if ((currentTime >= appointmentTime) && (currentTime <= appointmentEndTime) && (appointment.status === 'agendada')) {
                        try {
                            const response = await axios.patch(`${apiUrl}/appointment/update-status/${appointment.id}`, {status: "disponivel"});

                            if (response.status === 200) {
                                const updatedAppointments = appointments.map((a) =>
                                    a.id === appointment.id
                                        ? { ...a, status: 'disponivel' }
                                        : a
                                );

                                setAppointments(updatedAppointments);
                                setFilteredAppointments(updatedAppointments);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    } else if ((currentTime > appointmentEndTime) && (appointment.status === 'disponivel')) {
                        console.log('aqui')
                        try {
                            const response = await axios.patch(`${apiUrl}/appointment/update-status/${appointment.id}`, {status: "concluida"});

                            if (response.status === 200) {
                                const updatedAppointments = appointments.map((a) =>
                                    a.id === appointment.id
                                        ? { ...a, status: 'concluida' }
                                        : a
                                );

                                setAppointments(updatedAppointments);
                                setFilteredAppointments(updatedAppointments);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            });
        };

        // Executa imediatamente ao montar o componente
        checkAndUpdateAppointments();

        // Executa a cada 1 minuto
        const interval = setInterval(checkAndUpdateAppointments, 10000);

        // Limpa o intervalo quando desmontar o componente
        return () => clearInterval(interval);
    }, [appointments]);

    /**
     * Formata uma data no formato ISO para o padrão brasileiro (DD/MM/AAAA).
     * @param {string} dateString - Data no formato ISO.
     * @returns {string} - Data formatada em DD/MM/AAAA.
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    /**
     * Realiza o cancelamento de um agendamento específico,
     * atualizando o status no backend e refletindo imediatamente no frontend.
     * @param {number} appointmentId - ID do agendamento a ser cancelado.
     */
    const handleCancel = async (appointmentId) => {try {
            const response = await axios.patch(
                `${apiUrl}/appointment/update-status/${appointmentId}`,
                { status: 'cancelada' }
            );

            if (response.status === 200) {
                alert(response.data.message);

                const updatedAppointments = appointments.map((appointment) =>
                    appointment.id === appointmentId
                        ? { ...appointment, status: 'cancelada' }
                        : appointment
                );

                setAppointments(updatedAppointments);
                setFilteredAppointments(updatedAppointments);

                showDeleteForm();
                closeModal();
            }
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
        }
    };

    /**
     * Alterna a visibilidade do modal de confirmação de cancelamento.
     */
    const showDeleteForm = () => {
        setConfirmDeleteForm((prev) => !prev);
    };

    /**
     * Fecha o modal de detalhes do agendamento selecionado.
     */
    const closeModal = () => {
        setSelectedAppointment(null);
    };

    /**
     * Filtra os agendamentos com base no termo de busca informado.
     * A busca é realizada por status, data ou nome (médico ou paciente).
     * @param {string} query - Termo de busca.
     */
    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        const filtered = appointments.filter((appointment) => {
            const name =
                location.pathname === '/patient'
                    ? appointment.doctor_name
                    : appointment.patient_name;

            return (
                appointment.status.toLowerCase().includes(lowerQuery) ||
                appointment.appointment_date.toLowerCase().includes(lowerQuery) ||
                name.toLowerCase().includes(lowerQuery)
            );
        });

        setFilteredAppointments(filtered);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2 text-indigo-600">
                    <CalendarMonthIcon />
                    <h2 className="text-md font-semibold">Seus Agendamentos</h2>
                </div>
                <p className="text-sm text-gray-500">Lista dos seus agendamentos ativos.</p>

                {/* Legenda de status */}
                <div className="flex flex-col gap-1 mt-2">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Brightness1Icon fontSize="small" className="text-blue-500" /> Concluída
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Brightness1Icon fontSize="small" className="text-green-500" /> Disponível para acessar
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Brightness1Icon fontSize="small" className="text-yellow-500" /> Agendado
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Brightness1Icon fontSize="small" className="text-red-500" /> Cancelado
                    </p>
                </div>

                {/* Barra de pesquisa */}
                <div className="mt-3">
                    <SearchInput
                        placeholder="Pesquise por status, data ou nome"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            {/* Lista de agendamentos */}
            <div className="max-h-60 overflow-y-auto relative divide-y divide-gray-200">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            onClick={() => setSelectedAppointment(appointment)}
                            className="flex justify-between items-center py-3 px-4 bg-white hover:bg-indigo-50 rounded cursor-pointer transition-all"
                        >
                            <div className="flex flex-col">
                                <p className="text-base font-semibold text-gray-800">
                                    {location.pathname === '/patient'
                                        ? appointment.doctor_name
                                        : appointment.patient_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {appointment.institution_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatDate(appointment.appointment_date)} -{' '}
                                    {appointment.appointment_time}
                                </p>
                            </div>

                            {/* Ícone de status com cor dinâmica */}
                            <CalendarMonthIcon
                                className={`text-${statusColor[appointment.status]}-500`}
                            />
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
                    <div className="max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl w-full max-w-md relative">
                        {/* Botão de fechar */}
                        <div className="w-full px-3 flex justify-end">
                            <IconButton onClick={closeModal}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {/* Cabeçalho do modal */}
                        <div className="flex flex-col items-center bg-indigo-600 pb-6 pt-10">
                            {/* Ícone com cor baseada no status */}
                            <CalendarMonthIcon
                                fontSize='large'
                                className={`text-${statusColor[selectedAppointment.status]}-500`}
                            />
                            <h2 className="text-white text-lg font-semibold mt-3">
                                {location.pathname === '/patient'
                                    ? selectedAppointment.doctor_name
                                    : selectedAppointment.patient_name}
                            </h2>
                            <p className="text-indigo-100 text-sm">
                                {selectedAppointment.institution_name}
                            </p>
                        </div>

                        {/* Corpo do modal com os detalhes */}
                        <div className="p-6 space-y-3 text-gray-800 text-sm">
                            <p>
                                <strong>Data:</strong>{' '}
                                {formatDate(selectedAppointment.appointment_date)}
                            </p>
                            <p>
                                <strong>Horário:</strong>{' '}
                                {selectedAppointment.appointment_time}
                            </p>
                            {location.pathname === '/patient' ? (
                                <p>
                                    <strong>Médico:</strong>{' '}
                                    {selectedAppointment.doctor_name}
                                </p>
                            ) : (
                                <p>
                                    <strong>Paciente:</strong>{' '}
                                    {selectedAppointment.patient_name}
                                </p>
                            )}
                            <p>
                                <strong>Instituição:</strong>{' '}
                                {selectedAppointment.institution_name}
                            </p>

                            {/* Mostra o botão para acessar a telemedicina */}
                            {selectedAppointment.status === 'disponivel' && (
                                <Button
                                    variant='contained'
                                    color='success'
                                    fullWidth
                                    onClick={() => navigate(`/telemedicine/${selectedAppointment.id}`)}
                                >
                                    Acessar
                                </Button>
                            )}

                            <hr />

                            {/* Mostra botão de cancelar apenas se não estiver cancelada */}
                            {selectedAppointment.status !== 'cancelada' && selectedAppointment.status !== 'concluida' && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    startIcon={<DeleteIcon />}
                                    onClick={showDeleteForm}
                                >
                                    Cancelar Agendamento
                                </Button>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmação de cancelamento */}
            {confirmDeleteForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="w-80 h-auto absolute top-1/3 flex flex-col gap-3 bg-white shadow-lg rounded-lg p-3">
                        <p>
                            Tem certeza que deseja cancelar o agendamento com{' '}
                            <strong>{selectedAppointment.doctor_name}</strong>?
                        </p>

                        <hr />

                        <div className="flex gap-2">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleCancel(selectedAppointment.id)}
                            >
                                Sim
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
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
