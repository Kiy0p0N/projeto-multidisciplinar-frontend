import { useNavigate } from "react-router-dom";
import UndoIcon from '@mui/icons-material/Undo';
import { termsContent } from "../utils/termsContent";

function Terms() {
    const navigate = useNavigate();

    // Voltar para a página anterior
    const handleBack = () => navigate(-1);

    return (
        <main className="container min-h-screen flex justify-center items-center bg-gray-50 py-24 relative">
            {/* Botão de voltar */}
            <button
                onClick={handleBack}
                className="fixed left-5 top-24 cursor-pointer text-blue-500 hover:text-blue-700"
                aria-label="Voltar"
                title="Voltar"
            >
                <UndoIcon fontSize="large" />
            </button>

            {/* Conteúdo dos termos */}
            <div className="w-full max-w-lg h-[600px] bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-2">Termos e Condições de Uso</h1>
                <p className="text-sm text-gray-600 mb-6">Última atualização: 13/05/2025</p>

                {termsContent.map((section, index) => (
                    <section key={index} className="mb-5">
                        <h2 className="font-semibold text-blue-800">{section.title}</h2>

                        {section.content && (
                            <p className="text-gray-700 mt-1">{section.content}</p>
                        )}

                        {section.list && (
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                {section.list.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}
            </div>
        </main>
    );
}

export default Terms;
