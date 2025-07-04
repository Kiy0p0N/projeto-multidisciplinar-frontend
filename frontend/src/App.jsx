// Importa os componentes de rota do React Router
import { Routes, Route } from 'react-router-dom';

// Importa as páginas principais da aplicação
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import Terms from './pages/Terms';
import Admin from './pages/Admin';
import Patient from './pages/Patient';
import Doctor from './pages/Doctor';
import TeleMedicineRoom from './pages/TeleMedicineRoom';

// Importa componentes reutilizáveis de layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <>
      {/* Cabeçalho fixo em todas as rotas */}
      <Header />

      {/* Definição das rotas da aplicação */}
      <Routes>
        <Route path="/" element={<Home />} />                   {/* Página inicial */}
        <Route path="/login" element={<Login />} />             {/* Página de login */}
        <Route path="/register" element={<RegisterUser />} />   {/* Página de cadastro de usuário */}
        <Route path="/terms" element={<Terms />} />             {/* Página com os termos de uso */}
        <Route path='/admin' element={<Admin />} />             {/* Página do painel do administrador */}
        <Route path="/patient" element={<Patient />} />         {/* Página do painel do paciente */}
        <Route path='/doctor' element={<Doctor />} />           {/* Página do painel do médico */}
        <Route path="/telemedicine/:appointmentId" element={<TeleMedicineRoom />} />           {/* Página da telemedicina */}
      </Routes>

      {/* Rodapé fixo em todas as rotas */}
      <Footer />
    </>
  );
}

export default App;