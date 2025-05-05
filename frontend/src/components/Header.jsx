import Logo from "./Logo";
import SectionLink from "./SectionLink";

import { Button } from "@mui/material";

import { useLocation, Link } from "react-router-dom";

function Header() {
    // Detecta a rota atual
    const location = useLocation();

    const isHome = location.pathname === "/";
    const isLogin = location.pathname === "/login";

    return (
        <header className="w-full h-20 bg-blue-200 flex fixed items-center justify-between pr-5 pl-5 z-50">
                
            <Logo />

            <nav className="flex gap-4">
                {/* A navegação de seção só será exibida quando estiver na página Home ("/") */}
                {isHome && (
                    <>
                        <SectionLink href="#hero" text="Início" />
                        <SectionLink href="#services" text="Serviços" />
                        <SectionLink href="#about" text="Sobre" />
                    </>
                )}
            </nav>

            {/* O botão de acesso só será exibido quando estiver na página Home ("/") */}
            {isHome && (
                <>
                    <Link to="/login">
                        <Button variant="contained">Acessar</Button>
                    </Link>
                </>
            )}
        </header>
    );
}

export default Header;