/* Componentes */
import Card from "../components/Card";

/* Material ui */
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ComputerIcon from '@mui/icons-material/Computer';
import TimelineIcon from '@mui/icons-material/Timeline';

/* Imagem */
import Doctor from "../assets/image/medica.png";

import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="container">
            {/* Seção hero/inicial */}
            <section id="hero">
                <div  className="w-full h-dvh flex bg-blue-950 pl-5">

                    <div className="h-full w-auto flex flex-col justify-center gap-10 pl-5 ">
                        
                        <p className="text-white text-2xl font-semibold">Aqui cuidamos do que mais importa</p>
                        <h1 className="text-green-300 text-9xl font-extrabold">SUA SAÚDE</h1>

                        <Link to="/login">
                            <Button variant="contained" className="w-24">
                                Saiba <AddIcon />
                            </Button>
                        </Link>
                    </div>

                    <img src={Doctor} alt="Médica" className="absolute bottom-0 right-8 z-10 drop-shadow-lg drop-shadow-black" />

                    {/* Cria um triângulo atrás da imagem */}
                    <div className="absolute right-0 top-0 
                                w-0 h-0 
                                border-t-[100vh] border-t-transparent 
                                border-b-[0] border-b-transparent 
                                border-r-[35vw] border-r-green-300">
                    </div>

                </div>
            </section>

            {/* Seção de serviços oferecidos */}
            <section id="services">
                <div className="w-full pt-36 pb-0 px-5 flex justify-around">
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

            {/* Seção sobre a VidaPlus */}
            <section id="about">
                <div className="bg-white py-36 px-6 md:px-20 text-gray-800">
                    <div className="max-w-5xl mx-auto space-y-10">
                        <h2 className="text-4xl font-bold text-blue-600">🩺 Sobre o VidaPlus</h2>
                        <p className="text-lg">
                            <strong>VidaPlus</strong> é uma plataforma moderna de gestão hospitalar desenvolvida para tornar o
                            atendimento em saúde mais eficiente, ágil e acessível. Pensado para clínicas e hospitais
                            de pequeno e médio porte, o sistema centraliza agendamentos, prontuários e a comunicação
                            entre pacientes, médicos e administração.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-semibold text-blue-500">🎯 Nossa Missão</h3>
                                <p>Facilitar a gestão de instituições de saúde por meio da tecnologia, promovendo uma experiência mais humana e organizada para todos os envolvidos.</p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-blue-500">💡 Objetivo do Projeto</h3>
                                <p>Oferecer uma solução digital prática que elimina burocracias e melhora o fluxo de atendimento médico, desde o agendamento até o histórico clínico dos pacientes.</p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-blue-500">🌟 Nossos Valores</h3>
                                <ul className="list-disc list-inside space-y-1">
                                <li>Compromisso com a saúde</li>
                                <li>Inovação e eficiência</li>
                                <li>Segurança e privacidade dos dados</li>
                                <li>Acessibilidade e usabilidade</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-blue-500">👥 Para Quem é o VidaPlus</h3>
                                <p>Ideal para gestores hospitalares que desejam modernizar seus processos, médicos que buscam organização no atendimento e pacientes que valorizam praticidade e agilidade.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home;