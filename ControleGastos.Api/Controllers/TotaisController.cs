using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TotaisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TotaisController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Rota responsável por processar o relatório financeiro completo.
        /// A matemática (somas e saldos) é feita no Back-end para enviar os dados
        /// já consolidados, aliviando o processamento no Front-end.
        /// </summary>

        [HttpGet]
        public IActionResult ObterTotais()
        {
            var pessoasComTransacoes = _context.Pessoas
                .Include(p => p.Transacoes)
                .ToList();

            var relatorio = new RelatorioTotaisResponse();

            foreach (var pessoa in pessoasComTransacoes)
            {
                // .Where filtra por tipo, e .Sum soma a coluna Valor
                decimal receitas = pessoa.Transacoes?.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) ?? 0;
                decimal despesas = pessoa.Transacoes?.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor) ?? 0;

                // Adiciona a pessoa na lista do relatório
                relatorio.Pessoas.Add(new PessoaResumoDTO
                {
                    Nome = pessoa.Nome,
                    TotalReceitas = receitas,
                    TotalDespesas = despesas,
                    Saldo = receitas - despesas
                });

                // Vai acumulando os valores para o Total Geral
                relatorio.TotalGeralReceitas += receitas;
                relatorio.TotalGeralDespesas += despesas;
            }

            // Calcula o saldo líquido geral após somar todas as pessoas
            relatorio.SaldoLiquidoGeral = relatorio.TotalGeralReceitas - relatorio.TotalGeralDespesas;

            return Ok(relatorio);
        }
    }
}