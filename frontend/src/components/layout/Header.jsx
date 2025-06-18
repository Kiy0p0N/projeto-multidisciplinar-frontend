// Importa os componentes internos
import Logo from "../Logo";
import SectionLink from "../SectionLink";

// Importa botão e ícones do Material UI
import { Button, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Importa hooks do React Router
import { useLocation, useNavigate } from "react-router-dom";

// Importa hooks e Axios para requisição
import { useState } from "react";
import axios from 'axios';

// URL da API definida em constante
import { apiUrl } from "../../utils/constants";

function Header() {
    // Detecta a rota atual (útil para decidir se mostra ou não os links)
    const location = useLocation();
    const isHome = location.pathname === "/";
    const isRegister = location.pathname === "/register";

    // Hook para navegação programática
    const navigate = useNavigate();

    // Estado para controlar carregamento (evita múltiplos cliques no botão "Acessar")
    const [loading, setLoading] = useState(false);

    // Estado para abrir/fechar o menu no mobile
    const [menuOpen, setMenuOpen] = useState(false);

    // Função executada ao clicar em "Acessar"
    const handleSubmit = async () => {
        setLoading(true); // Ativa o loading
        try {
            // Faz uma requisição para buscar o usuário atual pela sessão
            const response = await axios.get(`${apiUrl}/user`, {
                withCredentials: true, // Garante que os cookies (sessão) sejam enviados
            });

            if (response.status === 200) {
                const user = response.data.user;

                // Redireciona para a página correta com base no tipo de usuário
                if (user?.type === "admin" || user?.type === "doctor" || user?.type === "patient") {
                    navigate(`/${user.type}`);
                } else {
                    console.warn("Tipo de usuário não reconhecido.");
                    navigate("/login");
                }
            }
        } catch (error) {
            // Se houver erro na requisição, retorna para a tela de login
            if (error.response) {
                console.warn("Erro do servidor:", error.response.data.message);
            } else {
                console.error("Erro desconhecido:", error);
            }
            navigate("/login");
        } finally {
            setLoading(false); // Desativa o loading
        }
    };

    return (
        <header className="w-full h-20 bg-blue-200 flex items-center justify-between px-5 fixed z-50">
            {/* Logo do projeto */}
            <Logo />

            {/* Menu de navegação para telas médias ou maiores (md) */}
            <nav className="hidden md:flex gap-6">
                {/* Só exibe os links na página inicial */}
                {isHome && (
                    <>
                        <SectionLink href="#hero" text="Início" />
                        <SectionLink href="#services" text="Serviços" />
                        <SectionLink href="#about" text="Sobre" />
                        <SectionLink href="#contact" text="Contato" />
                    </>
                )}
            </nav>

            {/* Botão "Acessar" visível apenas em telas médias ou maiores */}
            {(isHome || isRegister) && !loading && (
                <div className="hidden md:block">
                    <Button variant="contained" onClick={handleSubmit}>
                        Acessar
                    </Button>
                </div>
            )}
            
            {/* Botão do menu hamburguer, visível apenas no mobile */}
            {(isHome || isRegister) && (
                <div className="md:hidden">
                    <IconButton onClick={() => setMenuOpen(!menuOpen)}>
                        {/* Alterna entre ícone de menu aberto (Close) e fechado (Menu) */}
                        {menuOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </div>
            )}

            {/* Menu que aparece quando o menu hamburguer é ativado no mobile */}
            {(isHome || isRegister) && menuOpen && (
                <div className="absolute top-20 left-0 w-full bg-blue-200 flex flex-col items-center gap-4 py-4 md:hidden">
                    {/* Mesmos links da navegação principal, visíveis no mobile */}
                    {isHome && (
                        <>
                            <SectionLink href="#hero" text="Início" onClick={() => setMenuOpen(!menuOpen)} />
                            <SectionLink href="#services" text="Serviços" onClick={() => setMenuOpen(!menuOpen)} />
                            <SectionLink href="#about" text="Sobre" onClick={() => setMenuOpen(!menuOpen)} />
                            <SectionLink href="#contact" text="Contato" onClick={() => setMenuOpen(!menuOpen)} />
                        </>
                    )}

                    {/* Botão "Acessar" também aparece dentro do menu no mobile */}
                    {(isHome || isRegister) && !loading && (
                        <Button variant="contained" onClick={handleSubmit}>
                            Acessar
                        </Button>
                    )}
                </div>
            )}

        </header>
    );
}

export default Header;
