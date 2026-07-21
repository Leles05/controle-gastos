import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

// Moldes (Interfaces)
interface Pessoa {
  id: string;
  nome: string;
}

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: string; 
  pessoaId: string;
}

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  
  // Campos do formulário
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('1'); 
  const [pessoaId, setPessoaId] = useState('');

  const API_URL_TRANSACOES = 'http://localhost:5157/api/transacoes';
  const API_URL_PESSOAS = 'http://localhost:5157/api/pessoas';

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resTransacoes, resPessoas] = await Promise.all([
        axios.get(API_URL_TRANSACOES),
        axios.get(API_URL_PESSOAS)
      ]);
      
      setTransacoes(resTransacoes.data);
      setPessoas(resPessoas.data);
    } catch (erro) {
      alert("Erro ao buscar dados da API.");
    }
  };

  const cadastrarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pessoaId) {
      alert("Por favor, selecione uma pessoa.");
      return;
    }

    // 1. O TRUQUE DA VÍRGULA: Troca ',' por '.' e converte para número
    const valorFormatado = valor.replace(',', '.');
    const valorNumerico = Number(valorFormatado);

    // Proteção extra: se o usuário digitar letras no meio, o sistema avisa
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("Por favor, digite um valor numérico válido maior que zero.");
      return;
    }

    try {
      await axios.post(API_URL_TRANSACOES, { 
        descricao, 
        valor: valorNumerico, // Enviamos o número já corrigido
        tipo: Number(tipo), 
        pessoaId 
      });
      
      setDescricao('');
      setValor('');
      carregarDados();
    } catch (erro: any) {
      console.log("Erro completo:", erro.response); 

      if (erro.response && erro.response.data) {
        if (typeof erro.response.data === 'string') {
          alert("O Back-end recusou: " + erro.response.data);
        }
        else if (erro.response.data.mensagem) {
          alert("Aviso: " + erro.response.data.mensagem);
        }
        else if (erro.response.data.errors) {
          alert("Erro de validação. O C# recusou os dados enviados.");
        } else {
          alert("Erro desconhecido ao cadastrar.");
        }
      } else {
        alert("O Back-end está desligado ou inacessível.");
      }
    }
  };

  // 2. FUNÇÃO NOVA: Deletar Transação
  const deletarTransacao = async (id: string) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este lançamento?");
    if (!confirmacao) return;

    try {
      await axios.delete(`${API_URL_TRANSACOES}/${id}`);
      carregarDados(); 
    } catch (erro: any) {
      console.log("Erro completo ao deletar:", erro.response);
      
      if (erro.response && erro.response.status === 404) {
        alert("Erro 404: O Back-end não encontrou essa rota. Falta o método DELETE no C#?");
      } else if (erro.response && erro.response.status === 405) {
        alert("Erro 405: O método DELETE não é permitido nesta rota.");
      } else if (erro.response && erro.response.data) {
        alert("O C# recusou a exclusão: " + JSON.stringify(erro.response.data));
      } else {
        alert("Erro desconhecido. Verifique o terminal do C#.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Lançamento de Transações</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Formulário */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">Novo Lançamento</h2>
          
          <form onSubmit={cadastrarTransacao} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <input 
                type="text" required value={descricao} onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-black"
                placeholder="Ex: Conta de Luz"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Valor (R$)</label>
              {/* Mudamos de type="number" para type="text" para o navegador não bloquear a vírgula */}
              <input 
                type="text" required value={valor} onChange={(e) => setValor(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-black"
                placeholder="Ex: 150,50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                value={tipo} onChange={(e) => setTipo(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-black"
              >
                <option value="1">Despesa</option>
                <option value="0">Receita</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pessoa</label>
              <select 
                value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} required
                className="w-full p-2 border border-slate-300 rounded-lg text-black"
              >
                <option value="">Selecione quem gastou/recebeu...</option>
                {pessoas.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
              Salvar Lançamento
            </button>
          </form>
        </div>

        {/* Tabela de Histórico */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4">Descrição</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Tipo</th>
                <th className="p-4 text-center">Ações</th> {/* Coluna nova */}
              </tr>
            </thead>
            <tbody>
              {transacoes.map(t => (
                <tr key={t.id} className="border-b border-slate-100">
                  <td className="p-4">{t.descricao}</td>
                  <td className="p-4 font-medium">R$ {t.valor.toFixed(2)}</td>
                  <td className={`p-4 font-semibold ${t.tipo === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.tipo}
                  </td>
                  {/* Botão de excluir novo */}
                  <td className="p-4 flex justify-center">
                    <button 
                      onClick={() => deletarTransacao(t.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="Excluir lançamento"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {transacoes.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Nenhuma transação registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}