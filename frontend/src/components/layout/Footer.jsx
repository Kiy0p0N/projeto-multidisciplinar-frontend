// Componente de rodapé
function Footer() {
    return (
        <footer className="w-full border-t border-blue-300 bg-blue-100">
            {/* Container interno que centraliza o conteúdo */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-5 py-4 gap-4">
                
                {/* Texto de direitos autorais */}
                <p className="text-sm text-blue-600">
                    &copy; {new Date().getFullYear()} VidaPlus. Todos os direitos reservados.
                </p>

                {/* Links adicionais (pode adicionar mais se quiser) */}
                <div className="flex gap-6">
                    <a
                        href="#about"
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Sobre
                    </a>
                    <a
                        href="#services"
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Serviços
                    </a>
                    <a
                        href="#contact"
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Contato
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
