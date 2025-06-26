// Importações principais de bibliotecas e dependências
import { Button, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { apiUrl } from "../utils/constants";
import { io } from "socket.io-client";
import notificationSound from '../assets/audio/notification.mp3';

function TeleMedicineRoom() {
    // Estados globais do componente
    const [user, setUser] = useState(null);                      // Dados do usuário logado
    const [authorizedUser, setAuthorizedUser] = useState(false); // Verifica se usuário pode participar da consulta
    const [muted, setMuted] = useState(false);                   // Controle de mute
    const [message, setMessage] = useState("");                  // Mensagem digitada
    const [messages, setMessages] = useState([]);                // Lista de mensagens no chat
    const [loading, setLoading] = useState(true);                // Estado de carregamento da página

    // Hooks e referências
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const audioRef = useRef(new Audio(notificationSound));       // Referência do áudio de notificação

    /**
     * Função para tocar o som de notificação
     */
    const playSound = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.volume = 0.5;
        audio.play();
    };

    /**
     * Efeito responsável por:
     * 1. Buscar o usuário autenticado.
     * 2. Validar se ele tem autorização para acessar essa sala de consulta.
     */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user`, {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.user) {
                    setUser(response.data.user);
                } else {
                    navigate(-1); // Redireciona caso não esteja autenticado
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                navigate(-1);
            }
        };

        fetchUser();
    }, [navigate]);

    /**
     * Valida se o usuário pode participar da consulta após carregar os dados dele.
     */
    useEffect(() => {
        if (!user) return;

        const validateUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/appointments/${appointmentId}/validate-user/${user.id}`, {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.valid) {
                    setAuthorizedUser(true);
                } else {
                    setAuthorizedUser(false);
                }
            } catch (error) {
                console.error("Erro na validação de acesso:", error);
                setAuthorizedUser(false);
            } finally {
                setLoading(false);
            }
        };

        validateUser();
    }, [user, appointmentId]);

    /**
     * Efeito para conexão com socket.io e gerenciamento dos eventos de chat.
     */
    useEffect(() => {
        if (!user || !appointmentId || !authorizedUser) return;

        socketRef.current = io("http://localhost:3000");

        socketRef.current.emit("join_room", {
            room: appointmentId,
            user: { name: user.name, id: user.id },
        });

        socketRef.current.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
            playSound();
        });

        socketRef.current.on("user_joined", (data) => {
            setMessages((prev) => [...prev, { system: true, text: `${data.user.name} entrou na sala.` }]);
        });

        socketRef.current.on("user_left", (data) => {
            setMessages((prev) => [...prev, { system: true, text: `${data.user.name} saiu da sala.` }]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [user, appointmentId, authorizedUser]);

    /**
     * Função para enviar a mensagem:
     * 1. Envia a mensagem via Socket.IO (tempo real).
     * 2. Persiste a mensagem no banco via API REST (POST).
     */
    const sendMessage = async (e) => {
        e.preventDefault();

        if (message.trim() === "") return;

        const newMessage = {
            room: appointmentId,
            message,
            user: { name: user.name, id: user.id }
        };

        try {
            // Envio em tempo real via Socket.IO
            socketRef.current.emit("send_message", newMessage);

            // Persistir no banco de dados
            await axios.post(`${apiUrl}/message`, {
                appointmentId: appointmentId,
                userId: user.id,
                message: message
            }, {
                withCredentials: true // Garante que cookies de sessão sejam enviados
            });

            setMessage(""); // Limpa campo após envio
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    /**
     * Faz o scroll automático até a última mensagem quando houver atualização.
     */
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ==================
    // Renderização Condicional
    // ==================

    if (loading) {
        return (
            <main className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-500">Carregando sala de telemedicina...</p>
            </main>
        );
    }

    if (!user) return null;

    if (!authorizedUser) {
        return (
            <main className="w-full h-screen flex justify-center items-center bg-red-500/10">
                <h1 className="text-3xl sm:text-4xl font-bold text-red-600">
                    Acesso negado. Você não tem permissão para acessar esta consulta.
                </h1>
            </main>
        );
    }

    // ==================
    // Renderização Principal da Sala
    // ==================

    return (
        <main className="flex flex-col gap-2 min-h-screen bg-gray-100">
            {/* Cabeçalho */}
            <header className="mt-20 p-4 bg-indigo-700 text-white flex justify-between items-center shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold">Sala de Telemedicina</h2>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<CallEndIcon />}
                    onClick={() => navigate(-1)}
                >
                    Sair
                </Button>
            </header>

            {/* Corpo */}
            <section className="max-h-[80dvh] flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Área de Vídeo */}
                <div className="relative flex-1 bg-black flex items-center justify-center">
                    <video
                        id="localVideo"
                        autoPlay
                        playsInline
                        muted
                        className="w-1/4 sm:w-1/5 rounded-lg shadow-lg border-4 border-white absolute top-4 left-4 z-10"
                    ></video>

                    <video
                        id="remoteVideo"
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                    ></video>

                    {/* Controles de áudio e vídeo */}
                    <div className="absolute bottom-4 w-full flex justify-center gap-4">
                        <IconButton
                            onClick={() => setMuted(!muted)}
                            className="bg-white shadow-lg"
                            aria-label={muted ? "Ativar microfone" : "Mutar microfone"}
                        >
                            {muted ? <MicOffIcon className="text-red-500" /> : <MicIcon />}
                        </IconButton>

                        <IconButton className="bg-white shadow-lg" aria-label="Câmera">
                            <VideocamIcon />
                        </IconButton>
                    </div>
                </div>

                {/* Área de Chat */}
                <aside className="w-full min-h-full max-h-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-white flex flex-col">
                    {/* Cabeçalho do chat */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="text-md font-semibold text-gray-700">Chat</h3>
                    </div>

                    {/* Lista de mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                        {messages.map((msg, index) => (
                            msg.system ? (
                                <div key={index} className="text-center text-gray-500 text-xs">{msg.text}</div>
                            ) : (
                                <div
                                    key={index}
                                    className={`p-2 rounded shadow-sm max-w-xs ${
                                        msg.user.id === user.id
                                            ? "bg-indigo-100 text-indigo-800 self-end ml-auto"
                                            : "bg-gray-100 self-start"
                                    }`}
                                >
                                    <span className="block text-xs text-gray-500 mb-1">{msg.user.name}</span>
                                    <span className="break-words">{msg.message}</span>
                                </div>
                            )
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Campo de envio de mensagens */}
                    <form
                        onSubmit={sendMessage}
                        className="flex items-center p-3 gap-2 border-t"
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <IconButton type="submit" color="primary" aria-label="Enviar">
                            <SendIcon />
                        </IconButton>
                    </form>
                </aside>
            </section>
        </main>
    );
}

export default TeleMedicineRoom;
