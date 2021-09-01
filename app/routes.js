/**
 *
 * ROUTES PAGE
 * HERE YOU CAN ADD/REMOVE ANY ROUTES YOU WANT.
 * THIS IS ALSO THE PLACE WHERE YOU WOULD ADD ROUTE SECURITY
 * TO ENSURE THE SAFETY OF YOUR DATABASE.
 *
 **/

async function routes(fastify, options) {
  fastify.get('/', async (request, reply) => {
    return 'Hello World!';
  });

  /**
   *
   * INIT TABLE.
   * THIS IS A BACKUP, IN CASE THE USER'S TABLE ISN'T CREATED ON THE DOCKER BUILD.
   * RUN THIS ONLY ONCE TO CREATE THE USER'S TABLE.
   *
   **/

  // fastify.get('/initDB', (req, reply) => {
  //   fastify.pg.connect(onConnect);
  //   function onConnect(err, client, release) {
  //     if (err) return reply.send(err);
  //     client.query(
  //       'CREATE TABLE IF NOT EXISTS "users" ("id" SERIAL PRIMARY KEY,"name" varchar(30),"description" varchar(30),"tweets" integer);',
  //       function onResult(err, result) {
  //         release();
  //         reply.send(err || result);
  //       }
  //     );
  //   }
  // });

  /* GET ALL USERS */
  fastify.route({
    method: 'GET',
    url: '/users',
    handler: async function (request, reply) {
      fastify.pg.connect(onConnect);
      function onConnect(err, client, release) {
        if (err) {
          return reply.send(err);
        } else {
          client.query('SELECT * from users', function onResult(err, result) {
            release();
            reply.send(err || result.rows);
          });
        }
      }
    },
  });

  /* GET ONE USER */
  fastify.route({
    method: 'GET',
    url: '/users/:id',
    handler: async function (request, reply) {
      fastify.pg.connect(onConnect);
      function onConnect(err, client, release) {
        if (err) {
          return reply.send(err);
        } else {
          client.query(
            `SELECT * from users where id=${request.params.id}`,
            function onResult(err, result) {
              release();
              reply.send(err || result.rows[0]);
            }
          );
        }
      }
    },
  });

  /* CREATE USER */
  fastify.route({
    method: 'POST',
    url: '/users',
    handler: function (request, reply) {
      fastify.pg.connect(onConnect);
      function onConnect(err, client, release) {
        if (err) {
          return reply.send(err);
        } else {
          const newUser = request.body;
          client.query(
            `INSERT into users (name, email, description, tweets) VALUES('${newUser.name}', '${newUser.email}', '${newUser.description}', ${newUser.tweets})`,
            function onResult(err, result) {
              release();
              reply.send(err || 'User successfully created!');
            }
          );
        }
      }
    },
  });

  /* UPDATE ONE USER */
  fastify.route({
    method: 'PUT',
    url: '/users/:id',
    handler: async function (request, reply) {
      fastify.pg.connect(onConnect);
      async function onConnect(err, client, release) {
        if (err) {
          return reply.send(err);
        } else {
          const oldUserReq = await client.query(
            `SELECT * from users where id=${request.params.id}`
          );
          const oldUser = oldUserReq.rows[0];
          client.query(
            `UPDATE users SET(name, email, description, tweets) = ('${
              request.body.name
            }', '${request.body.email}', '${
              request.body.description || oldUser.description
            }', ${request.body.tweets || oldUser.tweets}) WHERE id=${
              request.params.id
            }`,
            function onResult(err, result) {
              release();
              reply.send(
                err ||
                  `User ID (${request.params.id}) has been successfully updated!`
              );
            }
          );
        }
      }
    },
  });

  /* DELETE ONE USER */
  fastify.route({
    method: 'DELETE',
    url: '/users/:id',
    handler: async function (request, reply) {
      fastify.pg.connect(onConnect);
      function onConnect(err, client, release) {
        if (err) {
          return reply.send(err);
        } else {
          client.query(
            `DELETE FROM users WHERE id=${request.params.id}`,
            function onResult(err, result) {
              release();
              reply.send(
                err ||
                  `User ID (${request.params.id}) has been successfully deleted.`
              );
            }
          );
        }
      }
    },
  });
}

module.exports = routes;
