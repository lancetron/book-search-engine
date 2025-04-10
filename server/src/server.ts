import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import db from './config/connection.js';
import { typeDefs } from './schemas/typeDefs.ts';
import { resolvers } from './schemas/resolvers.ts';
import { authenticateToken } from './services/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = token ? authenticateToken(req) : null;
    return { user };
  },
});

await server.start();

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => ({ user: req.user }),
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
