# 💰 Controle de Gastos

Um sistema Full-Stack para gestão financeira, permitindo o cadastro de participantes, lançamento de receitas e despesas, e visualização de um Dashboard consolidado com fluxo de caixa e saldo líquido.

## 🚀 Tecnologias Utilizadas

**Front-end:**
* **React (Vite):** Biblioteca para construção da interface de usuário.
* **Tailwind CSS:** Framework utilitário para estilização rápida e responsiva.
* **Axios:** Cliente HTTP para comunicação com a API.
* **Lucide React:** Biblioteca de ícones modernos.

**Back-end:**
* **C# (.NET):** Linguagem e framework base da API.
* **Entity Framework Core (EF Core):** ORM utilizado para manipulação do banco de dados.
* **SQLite:** Banco de dados relacional leve e embutido.
* **Padrão DTO:** Envelopamento de dados para otimizar as respostas da API e proteger as entidades do banco.

## 📁 Estrutura do Projeto (Monorepo)

O repositório foi organizado agrupando o Back-end e o Front-end no mesmo local para facilitar os testes e a execução:

* `/ControleGastos.Api`: Código-fonte da API Restful em C#.
* `/ControleGastos.Front`: Código-fonte da aplicação visual em React.

## ⚙️ Como executar o projeto localmente

### 1. Pré-requisitos
* [.NET SDK](https://dotnet.microsoft.com/download) instalado.
* [Node.js](https://nodejs.org/) instalado.

### 2. Clonar o repositório
```bash
git clone [https://github.com/Leles05/controle-gastos.git](https://github.com/Leles05/controle-gastos.git)
cd controle-gastos
´´´bash

### 3. Executando o Back-end (API)
```bash
cd ControleGastos.Api
dotnet restore
dotnet run
´´´bash

A API estará rodando em http://localhost:5157.

### 4. Executando o Front-end (React)
* **Abra um novo terminal na pasta raiz do projeto e execute:
```bash
cd ControleGastos.Front
npm install
npm run dev
´´´bash

Acesse http://localhost:5173 no seu navegador para utilizar o sistema.

Feito por Lucas
