CREATE TABLE users(
    "id" SERIAL PRIMARY KEY,
    "name" varchar(30),
    "email" VARCHAR(255),
    "description" varchar(255),
    "tweets" integer
);

