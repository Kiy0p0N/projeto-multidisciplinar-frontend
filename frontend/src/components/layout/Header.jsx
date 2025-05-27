import Logo from "../Logo";
import SectionLink from "../SectionLink";

import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";
import axios from 'axios';

function Header() {
    // Detecta a rota atual
    const location = useLocation();

    const isHome = location.pathname === "/";
    const isRegister = location.pathname === "/register";

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Evita cliques duplos ou loops

    // Função chamada ao clicar no botão "Acessar"
    const handleSubmit = async () => {
        setLoading(true); // Impede cliques múltiplos
        try {
            const response = await axios.get("http://localhost:3000/user", {
                withCredentials: true, // Garante que o cookie de sessão seja enviado
            });

            if (response.status === 200) {
                const user = response.data.user;

                // Redireciona para a rota de acordo com o tipo de usuário
                if (user?.type === "admin" || user?.type === "doctor" || user?.type === "patient") {
                    navigate(`/${user.type}`);
                } else {
                    console.warn("Tipo de usuário não reconhecido.");
                    navigate("/login");
                }
            }
        } catch (error) {
            // Redireciona para login caso a sessão não exista ou tenha expirado
            if (error.response) {
                console.warn("Erro do servidor:", error.response.data.message);
            } else {
                console.error("Erro desconhecido:", error);
            }
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="w-full h-20 bg-blue-200 flex fixed items-center justify-between px-5 z-50">
            <Logo />

            <nav className="flex gap-4">
                {/* Navegação de seções só é exibida na página inicial */}
                {isHome && (
                    <>
                        <SectionLink href="#hero" text="Início" />
                        <SectionLink href="#services" text="Serviços" />
                        <SectionLink href="#about" text="Sobre" />
                    </>
                )}
            </nav>

            {/* Botão "Acessar" aparece apenas na Home ou Registro e evita múltiplos cliques */}
            {(isHome || isRegister) && !loading && (
                <Button variant="contained" onClick={handleSubmit}>
                    Acessar
                </Button>
            )}
        </header>
    );
}

export default Header;
