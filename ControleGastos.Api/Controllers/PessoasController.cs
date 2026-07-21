using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // A rota será: http://localhost:porta/api/pessoas
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        // ROTA 1: LISTAR PESSOAS (GET /api/pessoas)
        [HttpGet]
        public IActionResult ListarPessoas()
        {
            var pessoas = _context.Pessoas
                .Select(p => new PessoaResponse 
                { 
                    Id = p.Id, 
                    Nome = p.Nome, 
                    Idade = p.Idade 
                })
                .ToList();

            return Ok(pessoas); // Retorna um status 200 com a lista em JSON
        }

        // ROTA 2: CRIAR PESSOA (POST /api/pessoas)
        [HttpPost]
        public IActionResult CriarPessoa([FromBody] CriarPessoaRequest request)
        {
            var novaPessoa = new Pessoa
            {
                Nome = request.Nome,
                Idade = request.Idade
                // O Id é gerado automaticamente pelo Guid.NewGuid() lá no Model!
            };

            _context.Pessoas.Add(novaPessoa);
            _context.SaveChanges(); // Salva no SQLite

            return CreatedAtAction(nameof(ListarPessoas), new { id = novaPessoa.Id }, novaPessoa);
        }

        // ROTA 3: DELETAR PESSOA (DELETE /api/pessoas/{id})
        [HttpDelete("{id}")]
        public IActionResult DeletarPessoa(Guid id)
        {
            var pessoa = _context.Pessoas.Find(id);
            
            if (pessoa == null)
            {
                return NotFound(new { mensagem = "Pessoa não encontrada." }); // Erro 404
            }

            // Graças àquela regra ".OnDelete(DeleteBehavior.Cascade)" no AppDbContext,
            // ao remover a pessoa aqui, as transações dela somem automaticamente do banco!
            _context.Pessoas.Remove(pessoa);
            _context.SaveChanges();

            return NoContent(); // Status 204 (Deu certo, mas não tenho texto para devolver)
        }
    }
}