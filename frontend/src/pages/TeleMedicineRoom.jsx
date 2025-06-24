import { Button, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../utils/constants";

function TeleMedicineRoom() {
    const [user, setUser] = useState(null);
    const [muted, setMuted] = useState(false);
    const [message, setMessage] = useState("");

    const { appointmentId } = useParams();
    const navigate = useNavigate();

    // Buscar usuário logado
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user`, {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.user) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                navigate(-1);
            }
        };
        fetchUser();
    }, [navigate]);

    if (user) {
        return (
            <main className="w-full min-h-dvh flex flex-col py-24 px-4 md:px-8 bg-gray-100 gap-6">
                {/* Header */}
                <div className="p-4 bg-indigo-700 text-white flex justify-between items-center shadow-md">
                    <h2 className="text-xl font-semibold">Sala de Telemedicina</h2>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<CallEndIcon />}
                        onClick={() => navigate(-1)}
                    >
                        Sair
                    </Button>
                </div>

                {/* Corpo */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Área de Vídeo */}
                    <div className="flex-1 bg-black relative flex items-center justify-center">
                        <video
                            id="localVideo"
                            autoPlay
                            playsInline
                            muted
                            className="w-1/3 rounded-lg shadow-lg border-4 border-white absolute top-4 left-4"
                        ></video>

                        <video
                            id="remoteVideo"
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        ></video>

                        {/* Controles de Vídeo */}
                        <div className="absolute bottom-5 flex gap-4 justify-center w-full">
                            <IconButton
                                onClick={() => setMuted(!muted)}
                                className="bg-white shadow-lg"
                            >
                                {muted ? <MicOffIcon className="text-red-500" /> : <MicIcon />}
                            </IconButton>
                            <IconButton className="bg-white shadow-lg">
                                <VideocamIcon />
                            </IconButton>
                        </div>
                    </div>

                    {/* Chat */}
                    <aside className="w-96 bg-white border-l flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-md font-semibold text-gray-700">Chat</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                            {/* Mensagens simuladas */}
                            <div className="bg-gray-100 p-2 rounded shadow-sm self-start max-w-xs">
                                Olá, pronto para a consulta?
                            </div>
                            <div className="bg-indigo-100 text-indigo-800 p-2 rounded shadow-sm self-end max-w-xs ml-auto">
                                Sim, estou sim.
                            </div>
                            {/* Aqui entram as mensagens reais */}
                        </div>

                        {/* Campo de mensagem */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (message.trim() !== "") {
                                    // enviar mensagem aqui
                                    setMessage("");
                                }
                            }}
                            className="flex items-center p-3 gap-2 border-t"
                        >
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
                </div>
            </main>
        );
    }
}

export default TeleMedicineRoom;
