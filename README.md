# API Agenda Compromissos

Aplicação desenvolvida em NODE.JS / Adonis

Uma API de agenda simples, com as seguintes funcionalidades:

- Multiplos usuarios(cada usuario possui sua propria agenda)
- Crie, edite e remova eventos em seu calendário
- Compartilhe eventos de sua agenda por email

### Requisitos

Ambiente de desenvolvimento para node.js instalado. 
Redis(Para fila de jobs) 
Banco de dados SQL 
[Projeto no Sentry](https://sentry.io), para captura de erros em produção

### Instalação

Clone o repositório

`git clone https://github.com/vieweg/api-agenda-node.git`

Acesse o diretório

`cd api-agenda-node`

Instale as dependências

`npm install`

Renomeie o arquivo `.env.example` para `.env` e efetue os ajustes confome necessário

Execute as migrations

`adonis migration:run`

Execute o servidor e o kue(para tratar os jobs)

`adonis serve`
`adonis kue:listen`

### Utilização

Utilize o insomnia, para simular as requisições a API

Rotas (Partindo da base `http://localhost:3333`)

Execute o comando abaixo para conhecer as rodas disponiveis

`adonis route:list`
