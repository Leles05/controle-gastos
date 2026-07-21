namespace ControleGastos.Api.DTOs
{
    public class PessoaResumoDTO
    {
        public string Nome { get; init; } = string.Empty;
        public decimal TotalReceitas { get; init; }
        public decimal TotalDespesas { get; init; }
        public decimal Saldo { get; init; }
    }

    public class RelatorioTotaisResponse
    {
        public List<PessoaResumoDTO> Pessoas { get; init; } = new();

        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquidoGeral { get; set; }
    }
}