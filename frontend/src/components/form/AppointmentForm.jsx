import { useState, useEffect } from 'react';

function AppointmentForm({ doctor, onClose }) {
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
        const allowedDays = doctor.available_days.map(day => dayMap[day.toLowerCase()]); // converte para número

        // Verifica os próximos 60 dias, mas para no máximo 30 datas válidas
        for (let i = 1; i <= 60; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);

            if (allowedDays.includes(date.getDay())) {
                dates.push(date);
            }

            if (dates.length >= 30) break;
        }

        setAvailableDates(dates); // atualiza estado
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
        if (!dateStr) return;

        // Corrige o formato da string para funcionar no Safari também
        const date = new Date(dateStr.replaceAll("-", "/"));

        // Pega o nome do dia da semana correspondente à data
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-', 1)[0];

        // Acessa os horários disponíveis do médico para aquele dia
        const schedule = doctor.schedule[weekday];

        if (!schedule) return;

        const times = [];
        const [startHour, startMin] = schedule.start.split(':').map(Number);
        const [endHour, endMin] = schedule.end.split(':').map(Number);

        let current = new Date(date);
        current.setHours(startHour, startMin, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, endMin, 0, 0);

        // Adiciona horários com intervalo de 30 minutos até o final do expediente
        while (current < end) {
            times.push(current.toTimeString().slice(0, 5)); // formato HH:MM
            current.setMinutes(current.getMinutes() + 30);
        }

        setAvailableTimes(times);
    };

    // Executa apenas uma vez ao montar o componente
    useEffect(() => {
        generateAvailableDates();
    }, []);

    // Gera horários sempre que uma nova data for selecionada
    useEffect(() => {
        generateAvailableTimes(selectedDate);
    }, [selectedDate]);

    // Envia os dados simulando o agendamento
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Consulta marcada com ${doctor.user_name} em ${selectedDate} às ${selectedTime}`);
        onClose(); // fecha o formulário
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
            <button
                type="submit"
                disabled={!selectedDate || !selectedTime}
                className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                Confirmar Agendamento
            </button>
        </form>
    );
}

export default AppointmentForm;
