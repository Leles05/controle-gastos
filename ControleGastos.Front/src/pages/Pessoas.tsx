import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, AlertTriangle } from 'lucide-react';

interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  
  // Controle do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [pessoaParaDeletar, setPessoaParaDeletar] = useState<Pessoa | null>(null);

  const API_URL = 'http://localhost:5157/api/pessoas';

  // Busca as pessoas assim que a tela abre
  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      const resposta = await axios.get(API_URL);
      setPessoas(resposta.data);
    } catch (erro) {
      alert("Erro ao buscar pessoas. O Back-end está rodando?");
    }
  };

  const cadastrarPessoa = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    try {
      await axios.post(API_URL, { nome, idade: Number(idade) });
      setNome('');
      setIdade('');
      carregarPessoas(); // Recarrega a tabela atualizada
    } catch (erro) {
      alert("Erro ao cadastrar pessoa.");
    }
  };

  // Funções do Modal
  const abrirModal = (pessoa: Pessoa) => {
    setPessoaParaDeletar(pessoa);
    setModalAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!pessoaParaDeletar) return;
    try {
      await axios.delete(`${API_URL}/${pessoaParaDeletar.id}`);
      setModalAberto(false);
      carregarPessoas();
    } catch (erro) {
      alert("Erro ao deletar pessoa.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Gestão de Pessoas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Formulário (Lado Esquerdo) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">Nova Pessoa</h2>
          
          <form onSubmit={cadastrarPessoa} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nome</label>
              <input 
                type="text" 
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: Lucas"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Idade</label>
              <input 
                type="number" 
                required
                min="0"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: 25"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cadastrar
            </button>
          </form>
        </div>

        {/* Tabela (Lado Direito) */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">Idade</th>
                <th className="p-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map(pessoa => (
                <tr key={pessoa.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700">{pessoa.nome}</td>
                  <td className="p-4 text-slate-700">{pessoa.idade} anos</td>
                  <td className="p-4 flex justify-center">
                    <button 
                      onClick={() => abrirModal(pessoa)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="Excluir pessoa"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {pessoas.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    Nenhuma pessoa cadastrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmação (Oculto por padrão) */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 text-amber-500 mb-4">
              <AlertTriangle size={32} />
              <h3 className="text-xl font-bold text-slate-800">Atenção!</h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja excluir <strong>{pessoaParaDeletar?.nome}</strong>? 
              Todas as transações vinculadas a esta pessoa também serão apagadas para sempre.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarExclusao}
                className="px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Sim, excluir tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}