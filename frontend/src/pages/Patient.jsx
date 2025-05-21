import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";

function Patient() {
    const [user, setUser] = useState(null); // Armazena o usuário logado
    const navigate = useNavigate();

    // Ao montar o componente, busca o usuário da sessão
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3000/user", {
                    withCredentials: true, // Inclui o cookie de sessão
                });

                if (response.status === 200 && response.data.user) {
                    setUser(response.data.user);
                } else {
                    console.log('user not found')
                }

            } catch (error) {
                console.log("Erro ao buscar usuário:", error);
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    // Realiza o logout
    const handleLogout = async () => {
        try {
            const response = await axios.get("http://localhost:3000/logout", {
                withCredentials: true,
            });

            if (response.status === 200) {
                navigate("/"); // Redireciona após logout
            }

        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return (
        <main className="container py-40 flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Área do Paciente</h1>

            {/* Campo somente leitura exibindo o nome do usuário */}
            {user && (
                <TextField
                    label="Usuário logado"
                    value={user.name}
                    className="w-80"
                />
            )}

            <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
            </Button>
        </main>
    );
}

export default Patient;
