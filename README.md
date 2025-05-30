# AgendaMed

O AgendaMed é um sistema de agendamento de consultas médicas com uma interface limpa e agradável.

## Como rodar o projeto

Para facilitar a execução do projeto, criei um `compose.yml`, que poderá ser utilizado para subir o projeto com Docker.

Teremos 3 serviços (ou camadas): front, api e banco de dados. 

Alterações que precisam ser feitas: criação de arquivo `.env` dentro de cada repositório.

A API terá o arquivo `.env` no formato:

``` env
DATABASE_URL="sqlserver://HOST:PORT;database=DATABASE;user=sa;password=PASSWORD;trustServerCertificate=true;encrypt=true"
```

## Tecnologias utilizadas

* Angular
* NestJS
* SQL Server

No Angular, para aumentar a produtividade e garantir o padrão de desenvolvimento de componentes, é utilizado o Angular Material.
No NestJS utilizaremos Prisma como ORM.

Para documentar o projeto, iremos utilizar o Swagger para a API e um README para cada camada.

## Banco de dados

Caso queira rodar o SQL Server com Docker, utilize o seguinte comando:
`docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=PASSWORD" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest`

Mude a senha, caso esteja em ambiente de produção.


A organização do banco de dados será com as seguintes tabelas:
1) Clients
    * name
    * email (unique)
    * password 

2) Appointments
    * speciality_id
    * doctor_id
    * schedule_day
    * schedule_hour
    * notes
    * status_code

3) Doctors
    * name
    * speciality_id

4) Specialities
    * name

5) Status
    * description
    * status_code (0, 1, 2)

6) Menu
    * item_name
    * url
    * admin_protected

## Autor
Antero Júnior

_Desenvolvedor Full Stack_
