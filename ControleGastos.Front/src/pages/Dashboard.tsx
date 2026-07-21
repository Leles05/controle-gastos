import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

// 1. Os Moldes (Exatamente iguais ao que seu C# devolve)
interface PessoaResumo {
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

interface Relatorio {
  pessoas: PessoaResumo[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquidoGeral: number;
}

export default function Dashboard() {
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarTotais();
  }, []);

  const carregarTotais = async () => {
    try {
      const resposta = await axios.get('http://localhost:5157/api/totais');
      setRelatorio(resposta.data);
    } catch (erro) {
      alert("Erro ao buscar os dados do Dashboard.");
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return <div className="text-center mt-20 text-slate-500 font-semibold text-lg">Carregando painel financeiro...</div>;
  }

  if (!relatorio) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Financeiro</h1>
        <p className="text-slate-500 mt-1">Acompanhe o fluxo de caixa geral e o saldo por pessoa.</p>
      </div>

      {/* Cartões de Totais Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Receitas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Receitas</p>
            <h3 className="text-2xl font-bold text-slate-800">
              R$ {relatorio.totalGeralReceitas.toFixed(2).replace('.', ',')}
            </h3>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <TrendingDown size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Despesas</p>
            <h3 className="text-2xl font-bold text-slate-800">
              R$ {relatorio.totalGeralDespesas.toFixed(2).replace('.', ',')}
            </h3>
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${relatorio.saldoLiquidoGeral >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Saldo Líquido Geral</p>
            <h3 className={`text-2xl font-bold ${relatorio.saldoLiquidoGeral >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
              R$ {relatorio.saldoLiquidoGeral.toFixed(2).replace('.', ',')}
            </h3>
          </div>
        </div>
      </div>

      {/* Resumo por Pessoa */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center space-x-2">
          <Users className="text-slate-500" size={20} />
          <h2 className="text-xl font-semibold text-slate-700">Resumo por Participante</h2>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <th className="p-4 font-medium">Nome</th>
              <th className="p-4 font-medium">Receitas</th>
              <th className="p-4 font-medium">Despesas</th>
              <th className="p-4 font-medium">Saldo Atual</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.pessoas.map((pessoa, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-semibold text-slate-700">{pessoa.nome}</td>
                <td className="p-4 text-green-600">R$ {pessoa.totalReceitas.toFixed(2).replace('.', ',')}</td>
                <td className="p-4 text-red-600">R$ {pessoa.totalDespesas.toFixed(2).replace('.', ',')}</td>
                <td className={`p-4 font-bold ${pessoa.saldo >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                  R$ {pessoa.saldo.toFixed(2).replace('.', ',')}
                </td>
              </tr>
            ))}
            {relatorio.pessoas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  Nenhuma pessoa cadastrada ou sem movimentações.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}