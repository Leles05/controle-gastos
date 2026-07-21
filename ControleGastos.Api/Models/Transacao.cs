namespace ControleGastos.Api.Models
{
    /// <summary>
    /// Define as opções permitidas para o tipo de uma transação.
    /// </summary>
    public enum TipoTransacao
    {
        Receita,
        Despesa
    }

    /// <summary>
    /// Classe que representa a tabela de Transações no banco de dados.
    /// </summary>
    public class Transacao
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Descricao { get; set; } = string.Empty;
        
        public decimal Valor { get; set; } 
        
        public TipoTransacao Tipo { get; set; }

        public Guid PessoaId { get; set; }
        
        public Pessoa? Pessoa { get; set; }
    }
}