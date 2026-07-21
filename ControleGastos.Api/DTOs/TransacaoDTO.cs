using ControleGastos.Api.Models;

namespace ControleGastos.Api.DTOs
{
    public class CriarTransacaoRequest
    {
        public string Descricao { get; init; } = string.Empty;
        public decimal Valor { get; init; }
        public TipoTransacao Tipo { get; init; }
        public Guid PessoaId { get; init; }
    }

    public class TransacaoResponse
    {
        public Guid Id { get; init; }
        public string Descricao { get; init; } = string.Empty;
        public decimal Valor { get; init; }
        public string Tipo { get; init; } = string.Empty; 
        public Guid PessoaId { get; init; }
    }
}