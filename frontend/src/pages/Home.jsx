/* Componentes */
import Card from "../components/Card";

/* Material ui */
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ComputerIcon from '@mui/icons-material/Computer';
import TimelineIcon from '@mui/icons-material/Timeline';

/* Imagem */
import Doctor from "../assets/image/medica.png";

function Home() {
    return (
        <main className="container">
            {/* Seção hero/inicial revisada */}
            <section id="hero" className="relative w-full min-h-dvh bg-blue-950 text-white overflow-hidden">
                <div className="w-full flex flex-col justify-end sm:pt-20 md:flex-row md:justify-between min-h-screen">

                    {/* Texto do hero */}
                    <div className="relative text-left md:w-1/2 flex flex-col justify-center md:pl-20">
                        <p className="text-xl text-center md:text-2xl font-medium md:text-left">Aqui cuidamos do que mais importa</p>
                        <h1 className="text-green-300 text-5xl text-center sm:text-6xl md:text-7xl font-extrabold leading-tight md:text-left">SUA SAÚDE</h1>
                        <p className="text-lg text-center max-w-md mx-auto md:mx-0 md:text-left">A VidaPlus é sua aliada na gestão eficiente e humana da saúde.</p>
                    </div>

                    {/* Imagem da médica */}
                    <div className="relative md:w-1/2 flex justify-center items-end">
                        <img 
                            src={Doctor} 
                            alt="Médica" 
                            className="w-60 sm:w-72 md:w-auto h-3/4 drop-shadow-lg z-10" 
                        />

                        {/* Triângulo decorativo atrás da imagem */}
                        <div className="hidden md:block absolute right-0 top-0 w-0 h-0 
                                    border-t-[100vh] border-t-transparent 
                                    border-b-0 border-b-transparent 
                                    border-r-[20vw] border-r-green-300 z-0">
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção de serviços responsiva */}
            <section id="services" className="bg-white py-24 px-5">
                <div className="flex flex-col md:flex-row gap-10 justify-around items-center">
                    <Card 
                        icon={<EventAvailableIcon fontSize="large" />} 
                        title="Agendamento Online" 
                        content="Evite filas e marque suas consultas com facilidade, diretamente pela plataforma." 
                    />

                    <Card
                        icon={<ComputerIcon fontSize="large" />}
                        title="Telemedicina"
                        content="Conecte-se com especialistas sem sair de casa, com segurança e praticidade."
                    />

                    <Card
                        icon={<TimelineIcon fontSize="large" />}
                        title="Histórico Clínico Digital"
                        content="Acesse seus exames e registros médicos de forma rápida, em um só lugar."
                    />
                </div>
            </section>

            {/* Seção sobre (atualizada) */}
            <section id="about" className="bg-gray-50 py-20 px-6 md:px-20 text-gray-800">
                <div className="max-w-5xl mx-auto space-y-10">
                    <h2 className="text-4xl font-bold text-blue-600">Sobre o VidaPlus</h2>
                    <p className="text-lg">
                        O <strong>VidaPlus</strong> é um sistema de gestão hospitalar pensado para aproximar tecnologia, segurança e eficiência em um só lugar. Voltado para unidades de pequeno e médio porte, ele simplifica rotinas e melhora a experiência tanto para os pacientes quanto para profissionais de saúde.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-semibold text-blue-500">Nossa Missão</h3>
                            <p>Usar a tecnologia para transformar o cuidado em saúde em algo mais eficiente, humanizado e acessível.</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-blue-500">Objetivo do Projeto</h3>
                            <p>Digitalizar processos hospitalares de forma intuitiva, promovendo agilidade e transparência na relação entre instituições e pacientes.</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-blue-500">Valores</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Inovação com responsabilidade</li>
                                <li>Respeito à privacidade</li>
                                <li>Acessibilidade para todos</li>
                                <li>Compromisso com resultados</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-blue-500">Público-Alvo</h3>
                            <p>Ideal para médicos, gestores de clínicas e hospitais que buscam modernizar o atendimento e fortalecer a relação com seus pacientes.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção de contatos */}
            <section id="contact" className="bg-blue-950 text-white py-20 px-6 md:px-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl font-bold text-green-300">Entre em Contato</h2>
                    <p className="text-lg">Ficou com dúvidas ou quer saber mais sobre o VidaPlus? Fale com a gente!</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <a className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 cursor-pointer">contato@vidaplus.com</a>
                        <a className="bg-white text-blue-950 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 cursor-pointer">(31) 99999-9999</a>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;