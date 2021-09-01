This project is fully automated. You should not have to download any additional software to your computer.

# Getting Started

## Docker

To run the Docker container, in your terminal run `docker-compose up --build`.

Once the Docker container is running, visit http://localhost:3050/api/ to get the 'Hello World!' test message.

## Postgres

### Data Tables

To add more tables to your database, go to `db -> init.sql`. There you can add all of your tables. The tables will be created when the Docker container is being built.

# Routes

To add your routes, go to `app -> routes.js`. Use the examples there to help you.

# Recommendations

I highly recommend adding some security to your routes. You need to protect your database from bad actors. One suggestion is [JWT](https://jwt.io/).
