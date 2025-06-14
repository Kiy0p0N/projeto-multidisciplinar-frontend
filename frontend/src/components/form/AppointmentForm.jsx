import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { apiUrl } from '../../utils/constants';
import axios from 'axios'; // Adiciona o axios para facilitar as requisições

function AppointmentForm({ patient_id, doctor, onClose }) {
    const [selectedDate, setSelectedDate] = useState(''); // Estado para armazenar a data selecionada pelo usuário
    const [availableDates, setAvailableDates] = useState([]); // Lista de datas disponíveis para agendamento
    const [availableTimes, setAvailableTimes] = useState([]); // Lista de horários disponíveis para o dia selecionado
    const [selectedTime, setSelectedTime] = useState(''); // Estado para armazenar o horário selecionado pelo usuário

    // Mapeamento dos dias da semana em português para seus índices (usado pelo objeto Date)
    const dayMap = {
        'domingo': 0,
        'segunda': 1,
        'terça': 2,
        'quarta': 3,
        'quinta': 4,
        'sexta': 5,
        'sábado': 6
    };

    // Gera uma lista com as próximas 30 datas em que o médico atende
    const generateAvailableDates = () => {
        const today = new Date();
        const dates = [];
        const allowedDays = doctor.available_days.map(day => dayMap[day.toLowerCase()]); // Converte para número

        // Verifica os próximos 60 dias, mas para no máximo 30 datas válidas
        for (let i = 0; i <= 60; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);

            if (allowedDays.includes(date.getDay())) {
                dates.push(date);
            }

            if (dates.length >= 30) break;
        }

        setAvailableDates(dates); // Atualiza estado
    };

    // Retorna o nome do dia da semana em português para uma determinada data
    const getDayName = (date) => {
        return date.toLocaleDateString('pt-BR', { weekday: 'long' });
    };

    // Formata uma data no formato YYYY-MM-DD (útil para valores de <select>)
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Gera os horários disponíveis para uma data selecionada
    const generateAvailableTimes = (dateStr) => {
        if (!dateStr) return; // Se nenhuma data foi selecionada, não faz nada

        // Corrige o formato da string para funcionar corretamente em todos os navegadores
        const date = new Date(dateStr.replaceAll("-", "/"));

        // Obtém o nome do dia da semana correspondente (ex: segunda, terça)
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-', 1)[0];

        // Pega o horário de expediente do médico para o dia da semana
        const schedule = doctor.schedule[weekday];
        if (!schedule) return; // Se o médico não atende nesse dia, sai da função

        const times = [];

        // Converte os horários de início e fim para números
        const [startHour, startMin] = schedule.start.split(':').map(Number);
        const [endHour, endMin] = schedule.end.split(':').map(Number);

        // Cria objetos Date para o horário inicial e final de atendimento
        let current = new Date(date);
        current.setHours(startHour, startMin, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, endMin, 0, 0);

        const now = new Date(); // Pega o horário atual

        // Loop para adicionar horários de 30 em 30 minutos enquanto não chegar no fim do expediente
        while (current < end) {
            // Se for um dia futuro, adiciona todos os horários
            // Se for hoje, só adiciona os horários que ainda não passaram
            if (
                date.toDateString() !== now.toDateString() || // data diferente de hoje
                current > now // ou horário ainda futuro
            ) {
                times.push(current.toTimeString().slice(0, 5)); // Ex: '14:30'
            }

            current.setMinutes(current.getMinutes() + 30); // Avança 30 minutos
        }

        setAvailableTimes(times); // Atualiza o estado com os horários disponíveis
    };

    // Executa apenas uma vez ao montar o componente
    useEffect(() => {
        generateAvailableDates();
    }, []);

    // Gera horários sempre que uma nova data for selecionada
    useEffect(() => {
        generateAvailableTimes(selectedDate);
    }, [selectedDate]);

    // Envia os dados para o backend, criando o agendamento
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Monta os dados para enviar ao backend
            const appointmentData = {
                doctor_id: doctor.id,                  // ID do médico
                patient_id: patient_id,                // ID do paciente
                institution_id: doctor.institution_id, // Id da instituição
                date: selectedDate,                    // Data selecionada (YYYY-MM-DD)
                time: selectedTime                     // Horário selecionado (HH:MM)
            };

            console.log(appointmentData)

            // Faz o POST para o backend na rota de agendamentos
            const response = await axios.post(`${apiUrl}/appointments`, appointmentData);

            // Se der certo, mostra mensagem de sucesso
            if (response.status === 201) {
                alert(response.data.message);
                window.location.reload(); // Força o refresh da página

            }
        } catch (error) {
            // Caso ocorra algum erro, exibe a mensagem
            console.error(error);
            alert(error.response?.data?.message || 'Erro ao agendar a consulta');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t space-y-4">
            {/* Campo de seleção de datas */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Escolha uma data</label>
                <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                >
                    <option value="">Selecione...</option>
                    {availableDates.map((date, index) => (
                        <option key={index} value={formatDate(date)}>
                            {/* Exibe o dia da semana e a data formatada */}
                            {getDayName(date).charAt(0).toUpperCase() + getDayName(date).slice(1)} - {date.toLocaleDateString('pt-BR')}
                        </option>
                    ))}
                </select>
            </div>

            {/* Campo de seleção de horários, aparece somente se uma data for selecionada */}
            {selectedDate && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Escolha um horário</label>
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full border px-3 py-2 rounded mt-1"
                    >
                        <option value="">Selecione...</option>
                        {availableTimes.map((time, idx) => (
                            <option key={idx} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Botão para confirmar agendamento, desativado até que ambos os campos sejam preenchidos */}
            <Button
                type='submit'
                variant='contained'
                color='secondary'
                disabled={!selectedDate || !selectedTime}
            >
                Realizar agendamento
            </Button>
        </form>
    );
}

export default AppointmentForm;
