import { useNavigate } from "react-router-dom";
import UndoIcon from '@mui/icons-material/Undo';

function Terms() {
    // Hook de navegação para voltar à página anterior
    const navigate = useNavigate();

    // Função que retorna uma página no histórico
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <main className="container items-center justify-center py-24 relative">
            {/* Ícone de voltar no topo esquerdo */}
            <button 
                onClick={handleBack} 
                className="fixed left-5 top-24 text-blue-500 hover:text-blue-700 cursor-pointer"
                aria-label="Voltar"
                title="Voltar"
            >
                <UndoIcon fontSize="large" />
            </button>

            {/* Caixa com os termos */}
            <div className="w-[400px] h-[600px] flex flex-col gap-4 rounded-2xl shadow-2xl p-5 overflow-y-auto mx-auto">
                <h1 className="text-2xl font-medium">Termos e Condições de Uso</h1>

                <p className="text-sm text-gray-600">Última atualização: 13/05/2025</p>

                <p>
                    Bem-vindo à <strong>VidaPlus</strong>! Estes Termos e Condições de Uso (“Termos”) regem o acesso e o uso da nossa
                    plataforma de gestão hospitalar e de serviços de saúde (“Sistema VidaPlus”), disponibilizado por
                    <strong> VidaPlus Tecnologia em Saúde Ltda.</strong> (“VidaPlus”, “nós”, “nosso”).
                </p>

                <p>
                    Ao acessar, se cadastrar ou utilizar qualquer funcionalidade do Sistema VidaPlus, você (“Usuário”) concorda com estes Termos.
                    Caso não concorde, não utilize a plataforma.
                </p>

                <hr />

                {/* Seções dos termos */}
                <section>
                    <h2 className="font-semibold">1. Objetivo da Plataforma</h2>
                    <p>
                        O Sistema VidaPlus tem como objetivo oferecer uma solução digital para a gestão de atendimentos, cadastros de pacientes,
                        profissionais de saúde, agendamentos, prontuários e outros serviços voltados ao ambiente hospitalar e clínico.
                    </p>
                </section>

                <section>
                    <h2 className="font-semibold">2. Cadastro e Responsabilidade do Usuário</h2>
                    <ul className="list-disc pl-5">
                        <li>O uso da plataforma requer cadastro prévio com dados verdadeiros, atualizados e completos.</li>
                        <li>O Usuário é responsável por manter a confidencialidade de suas credenciais de acesso.</li>
                        <li>É proibido criar contas falsas, se passar por terceiros ou fornecer informações fraudulentas.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-semibold">3. Uso Adequado</h2>
                    <p>Você se compromete a:</p>
                    <ul className="list-disc pl-5">
                        <li>Utilizar a plataforma apenas para fins legais e autorizados.</li>
                        <li>Não compartilhar informações sensíveis de pacientes de maneira indevida.</li>
                        <li>Não comprometer a segurança, desempenho ou integridade do sistema.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-semibold">4. Privacidade e Proteção de Dados</h2>
                    <p>
                        A VidaPlus respeita a sua privacidade. Os dados pessoais e sensíveis tratados pela plataforma seguem as diretrizes da
                        <strong> Lei Geral de Proteção de Dados (LGPD – Lei 13.709/2018)</strong>.
                    </p>
                    <p>Para mais informações, consulte nossa Política de Privacidade.</p>
                </section>

                <section>
                    <h2 className="font-semibold">5. Propriedade Intelectual</h2>
                    <p>
                        Todo o conteúdo, código-fonte, marcas, logotipos e interfaces do Sistema VidaPlus são de propriedade exclusiva da empresa
                        ou licenciados a ela. É proibida a reprodução, cópia ou engenharia reversa sem autorização formal.
                    </p>
                </section>

                <section>
                    <h2 className="font-semibold">6. Suspensão ou Encerramento de Acesso</h2>
                    <p>
                        Reservamo-nos o direito de suspender ou cancelar o acesso do Usuário em caso de violação destes Termos,
                        uso indevido, fraude ou suspeita de atividade maliciosa.
                    </p>
                </section>

                <section>
                    <h2 className="font-semibold">7. Limitação de Responsabilidade</h2>
                    <ul className="list-disc pl-5">
                        <li>Erros de operação decorrentes do uso indevido da plataforma;</li>
                        <li>Interrupções temporárias por motivos técnicos ou manutenção;</li>
                        <li>Danos indiretos causados por falhas externas à nossa responsabilidade.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-semibold">8. Alterações nos Termos</h2>
                    <p>
                        Estes Termos podem ser atualizados periodicamente. Recomendamos que o Usuário revise os termos regularmente.
                        O uso contínuo do sistema após mudanças implica concordância com as atualizações.
                    </p>
                </section>

                <section>
                    <h2 className="font-semibold">9. Contato</h2>
                    <p>Em caso de dúvidas, entre em contato pelo e-mail: <strong>contato@vidaplus.com.br</strong></p>
                </section>
            </div>
        </main>
    );
}

export default Terms;
