Tecnologias Utilizadas

Backend:

Java 17

Spring Boot

Spring Web

Spring Data JPA

MySQL 8

Maven

Lombok

JPA/Hibernate


VARIAVEIS DE AMBIENTE:
DB_PASSWORD=senha;DB_URL=jdbc:mysql://localhost:3306/booksite_db;DB_USERNAME=root




Frontend:

React

TypeScript

Vite

Axios (para consumo da API)

React Router DOM

CSS manual



🧐 Decisões de Arquitetura

🏩 Backend - Arquitetura MVC (Model-View-Controller)

Model (Entidades):

Apartment, Reservation, Contact representam diretamente as tabelas do banco.

Mapeadas com JPA e Hibernate para facilitar persistência de dados.

Repository:

Interfaces que estendem JpaRepository, com métodos customizados usando query methods do Spring Data.

Consultas complexas usando @Query.

Service:

Contém toda a lógica de negócio, como persistência, filtros por cidade/data e cálculo de estatísticas.

Controller:

Define os endpoints RESTful, como /api/reservas, /api/apartments, /api/contacts.

Se comunica com os serviços e retorna respostas estruturadas em JSON.

CORS configurado diretamente no @CrossOrigin dos controllers para integração frontend/backend.

💡 Frontend

Utiliza React com TypeScript para segurança de tipos e manutenção de código.

Rotas protegidas com React Router.

Componentes reutilizáveis para formulários (ReservationForm, ApartamentoForm, etc.).

Integração com API via Axios.



Dashboard com estatísticas de reservas no último mês.

📊 Funcionalidades

Cadastro de apartamentos, contatos e reservas

Filtro de reservas por cidade e período

Listagem de reservas com detalhes

Visualização de estatísticas no dashboard:

Total de reservas no mês

Faturamento por canal

Cidades com mais reservas
