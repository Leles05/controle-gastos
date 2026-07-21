using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        // ROTA 1: LISTAR TRANSAÇÕES (GET /api/transacoes)
        [HttpGet]
        public IActionResult ListarTransacoes()
        {
            var transacoes = _context.Transacoes
                .Select(t => new TransacaoResponse
                {
                    Id = t.Id,
                    Descricao = t.Descricao,
                    Valor = t.Valor,
                    Tipo = t.Tipo.ToString(), 
                    PessoaId = t.PessoaId
                })
                .ToList();

            return Ok(transacoes);
        }

        // ROTA 2: CRIAR TRANSAÇÃO (POST /api/transacoes)
        [HttpPost]
        public IActionResult CriarTransacao([FromBody] CriarTransacaoRequest request)
        {
            // Validação 1: A pessoa informada existe no banco de dados?
            var pessoa = _context.Pessoas.Find(request.PessoaId);
            
            if (pessoa == null)
            {
                return NotFound(new { mensagem = "A pessoa informada não existe no sistema." });
            }

            // Validação 2: A Regra de Negócio do Desafio (Menor de idade)
            if (pessoa.Idade < 18 && request.Tipo == TipoTransacao.Receita)
            {
                return BadRequest(new { mensagem = "Regra violada: Pessoas menores de 18 anos só podem cadastrar transações do tipo Despesa." });
            }

            if (request.Valor <= 0)
            {
                return BadRequest(new { mensagem = "O valor da transação deve ser maior que zero." });
            }
            
            var novaTransacao = new Transacao
            {
                Descricao = request.Descricao,
                Valor = request.Valor,
                Tipo = request.Tipo,
                PessoaId = request.PessoaId
            };

            _context.Transacoes.Add(novaTransacao);
            _context.SaveChanges();

            return CreatedAtAction(nameof(ListarTransacoes), new { id = novaTransacao.Id }, novaTransacao);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarTransacao(Guid id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null)
            {
                return NotFound();
            }

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Transação deletada com sucesso!" });
        }
    }
}