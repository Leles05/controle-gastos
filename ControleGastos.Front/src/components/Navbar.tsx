import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ArrowRightLeft } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
      : "flex items-center gap-2 text-gray-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-all";
  };

  return (
    <nav className="bg-slate-900 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-white text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">💰</span> Controle de Gastos
        </div>

        {/* Botões de Navegação */}
        <div className="flex gap-2">
          <Link to="/" className={getLinkClass("/")}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          
          <Link to="/pessoas" className={getLinkClass("/pessoas")}>
            <Users size={20} />
            Pessoas
          </Link>

          <Link to="/transacoes" className={getLinkClass("/transacoes")}>
            <ArrowRightLeft size={20} />
            Transações
          </Link>
        </div>
      </div>
    </nav>
  );
}