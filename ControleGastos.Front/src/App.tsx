import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Pessoas from './pages/Pessoas';
import Transacoes from './pages/Transacoes';
import Dashboard from './pages/Dashboard'; 

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        
        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} /> 
            
            <Route path="/pessoas" element={<Pessoas />} />
            <Route path="/transacoes" element={<Transacoes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}