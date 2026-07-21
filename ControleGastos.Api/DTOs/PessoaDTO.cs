namespace ControleGastos.Api.DTOs
{
    public class CriarPessoaRequest
    {
        public string Nome { get; init; } = string.Empty;
        public int Idade { get; init; }
    }

    public class PessoaResponse
    {
        public Guid Id { get; init; }
        public string Nome { get; init; } = string.Empty;
        public int Idade { get; init; }
    }
}