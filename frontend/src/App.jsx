import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';

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
      </Routes>

      <Footer />
    </>
  )
}

export default App
