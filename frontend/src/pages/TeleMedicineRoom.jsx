// Componente de sala de telemedicina com chat e videochamada (WebRTC + Socket.IO)

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";
import axios from "axios";
import { apiUrl } from "../utils/constants";
import notificationSound from '../assets/audio/notification.mp3';

function TeleMedicineRoom() {
    // Estados de controle de usuário, mídia, chat e autorização
    const [user, setUser] = useState(null);
    const [authorizedUser, setAuthorizedUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [otherUsers, setOtherUsers] = useState([]);

    // Referências para elementos DOM, sockets e media streams
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const audioRef = useRef(new Audio(notificationSound));
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const localStream = useRef(null);

    /** Toca o som de notificação */
    const playSound = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.volume = 0.5;
        audio.play();
    };

    /** Busca informações do usuário autenticado */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${apiUrl}/user`, { withCredentials: true });
                if (res.status === 200 && res.data.user) {
                    setUser(res.data.user);
                } else {
                    navigate(-1); // Retorna à página anterior se não estiver autenticado
                }
            } catch {
                navigate(-1);
            }
        };
        fetchUser();
    }, [navigate]);

    /** Valida se o usuário tem permissão para acessar essa sala */
    useEffect(() => {
        if (!user) return;
        const validateAccess = async () => {
            try {
                const res = await axios.get(`${apiUrl}/appointments/${appointmentId}/validate-user/${user.id}`, { withCredentials: true });
                setAuthorizedUser(res.data.valid);
            } catch {
                setAuthorizedUser(false);
            } finally {
                setLoading(false);
            }
        };
        validateAccess();
    }, [user, appointmentId]);

    /** Busca as mensagens anteriores salvas no backend */
    const fetchPreviousMessages = async () => {
        try {
            const res = await axios.get(`${apiUrl}/messages/${appointmentId}`, { withCredentials: true });
            setMessages(res.data.messages);
        } catch (error) {
            console.error("Erro ao buscar mensagens anteriores:", error);
        }
    };

    /** Inicializa sockets, media e eventos da sala */
    useEffect(() => {
        if (!user || !authorizedUser) return;

        // Conexão socket
        socketRef.current = io(apiUrl);

        // Entra na sala
        socketRef.current.emit("join_room", { room: appointmentId, user: { name: user.name, id: user.id } });

        // Eventos de socket
        socketRef.current.on("other_users", (users) => setOtherUsers(users));
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

        // WebRTC: recebendo oferta
        socketRef.current.on("offer", async ({ offer, sender }) => {
            await createPeer();
            await peerConnection.current.setRemoteDescription(offer);
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socketRef.current.emit("answer", {
                answer,
                room: appointmentId,
                sender: socketRef.current.id,
                target: sender // responde diretamente para quem enviou a offer
            });
        });


        // WebRTC: recebendo resposta
        socketRef.current.on("answer", async ({ answer }) => {
            await peerConnection.current.setRemoteDescription(answer);
        });

        // WebRTC: recebendo ICE
        socketRef.current.on("ice_candidate", async ({ candidate }) => {
            if (candidate) await peerConnection.current.addIceCandidate(candidate);
        });

        // Inicializa vídeo local
        initializeMedia();

        // Busca mensagens anteriores
        fetchPreviousMessages();

        // Cleanup na desmontagem do componente
        return () => {
            socketRef.current.disconnect();
            if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
            if (peerConnection.current) peerConnection.current.close();
        };
    }, [user, appointmentId, authorizedUser]);

    /** Inicializa mídia local e estabelece chamada se houver outro usuário */
    const initializeMedia = async () => {
        try {
            localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;

            if (otherUsers.length > 0) {
                await createPeer();
                const offer = await peerConnection.current.createOffer();
                await peerConnection.current.setLocalDescription(offer);
                socketRef.current.emit("offer", { offer, room: appointmentId, sender: socketRef.current.id });
            }
        } catch (err) {
            console.error("Erro ao acessar dispositivos de mídia:", err);
        }
    };

    /** Cria conexão peer-to-peer (WebRTC) */
    const createPeer = async () => {
        if (peerConnection.current) return;

        peerConnection.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        if (localStream.current) {
            localStream.current.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, localStream.current);
            });
        }

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit("ice_candidate", {
                    candidate: event.candidate,
                    room: appointmentId,
                    sender: socketRef.current.id
                });
            }
        };

        peerConnection.current.ontrack = (event) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };
    };

    /** Envia mensagem para o chat e salva no backend */
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = { room: appointmentId, message, user: { name: user.name, id: user.id } };

        try {
            // Envia pelo socket para sala
            socketRef.current.emit("send_message", newMessage);

            // Persiste no backend
            await axios.post(`${apiUrl}/message`, {
                appointmentId: appointmentId,
                userId: user.id,
                message
            }, { withCredentials: true });

            setMessage("");
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    /** Mantém o scroll do chat sempre no final */
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /** Ativa ou desativa o microfone */
    const toggleMute = () => {
        if (localStream.current) {
            localStream.current.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
            setMuted(prev => !prev);
        }
    };

    /** Ativa ou desativa a câmera */
    const toggleCamera = () => {
        if (localStream.current) {
            localStream.current.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
            setCameraOff(prev => !prev);
        }
    };

    // ==============================
    // Renderização Condicional
    // ==============================

    if (loading) {
        return (
            <main className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-500">Carregando sala de telemedicina...</p>
            </main>
        );
    }

    if (!authorizedUser) {
        return (
            <main className="w-full h-screen flex justify-center items-center bg-red-500/10">
                <h1 className="text-3xl font-bold text-red-600">
                    Acesso negado. Você não tem permissão para acessar esta consulta.
                </h1>
            </main>
        );
    }

    // ==============================
    // Renderização da UI
    // ==============================

    return (
        <main className="flex flex-col gap-2 min-h-screen bg-gray-100">
            <header className="mt-20 p-4 bg-indigo-700 text-white flex justify-between items-center shadow-md">
                <h2 className="text-xl font-semibold">Sala de Telemedicina</h2>
                <Button variant="contained" color="error" startIcon={<CallEndIcon />} onClick={() => navigate(-1)}>
                    Sair
                </Button>
            </header>

            <section className="flex flex-col lg:flex-row flex-1 max-h-[80dvh]">
                {/* Área de vídeo */}
                <div className="relative flex-1 flex items-center justify-center">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-1/4 sm:w-1/5 rounded-lg shadow-lg border-4 border-white absolute top-4 left-4 z-10" />
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain" />

                    <div className="absolute bottom-4 w-full flex justify-center gap-4">
                        <IconButton onClick={toggleMute} className="bg-white shadow-lg">
                            {muted ? <MicOffIcon className="text-red-500" /> : <MicIcon />}
                        </IconButton>
                        <IconButton onClick={toggleCamera} className="bg-white shadow-lg">
                            <VideocamIcon className={cameraOff ? "text-red-500" : ""} />
                        </IconButton>
                    </div>
                </div>

                {/* Área de chat */}
                <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-white flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="text-md font-semibold text-gray-700">Chat</h3>
                    </div>
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

                    <form onSubmit={sendMessage} className="flex items-center p-3 gap-2 border-t">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <IconButton type="submit" color="primary">
                            <SendIcon />
                        </IconButton>
                    </form>
                </aside>
            </section>
        </main>
    );
}

export default TeleMedicineRoom;
