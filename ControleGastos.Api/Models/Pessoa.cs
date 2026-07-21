namespace ControleGastos.Api.Models
{
    /// <summary>
    /// Classe que representa a tabela de Pessoas no banco de dados.
    /// </summary>
    public class Pessoa
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Já gera o UUID automaticamente na criação
        
        public string Nome { get; set; } = string.Empty;
        
        public int Idade { get; init; }

        public List<Transacao> Transacoes { get; set; } = new();
    }
}