import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Pessoas from './pages/Pessoas';
import Transacoes from './pages/Transacoes'; // Importação nova

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        
        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<h1 className="text-3xl font-bold">Em breve: Dashboard</h1>} />
            <Route path="/pessoas" element={<Pessoas />} />
            
            {/* Rota atualizada */}
            <Route path="/transacoes" element={<Transacoes />} /> 
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}