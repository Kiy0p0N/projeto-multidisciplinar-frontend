import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import Terms from './pages/Terms';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      {/* Navbar */}
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<RegisterUser />} />
        <Route path='/terms' element={<Terms />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
