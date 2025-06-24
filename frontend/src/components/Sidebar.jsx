import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/constants";

function Sidebar({ infoContent, buttons = [], text }) {
    const [openInfo, setOpenInfo] = useState(false);
    const navigate = useNavigate();

    // Logout
    const handleLogout = async () => {
        try {
            const response = await axios.get(`${apiUrl}/logout`, {
                withCredentials: true,
            });
            if (response.status === 200) {
                navigate("/");
            }
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return (
        <>
            {/* Barra lateral */}
            <div className="fixed top-1/2 right-0 -translate-y-1/2 bg-blue-50 rounded-l-3xl shadow-md flex flex-col gap-6 p-3 z-50">

                {/* Botão fixo de perfil */}
                <button
                    onClick={() => setOpenInfo(true)}
                    className="p-2 hover:bg-blue-100 rounded-full cursor-pointer"
                >
                    <PersonIcon className="text-blue-600" />
                </button>

                {/* Botões dinâmicos */}
                {buttons.map((btn, index) => (
                    btn.onClick ? (
                        <button
                            key={index}
                            text={text}
                            onClick={btn.onClick}
                            className="p-2 hover:bg-blue-100 rounded-full"
                        >
                            {btn.icon}
                        </button>
                    ) : (
                        <a
                            key={index}
                            href={btn.href}
                            className="p-2 hover:bg-blue-100 rounded-full"
                        >
                            {btn.icon}
                        </a>
                    )
                ))}
            </div>

            {/* Card lateral de informações */}
            {openInfo && (
                <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-5 flex flex-col">
                    <div className="flex justify-end items-center mb-4">
                        <button onClick={() => setOpenInfo(false)} className="bg-transparent p-1 rounded-full cursor-pointer hover:bg-zinc-300/50">
                            <CloseIcon />
                        </button>
                    </div>
                    {infoContent}

                    <br />
                    
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon />}
                        className="w-full mt-6"
                        onClick={handleLogout}
                    >
                        Finalizar Sessão
                    </Button>
                </div>
            )}
        </>
    );
}

export default Sidebar;
