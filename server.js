import { ApolloServer } from 'apollo-server';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import client from './client';

import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        return {
            loggedInUser: await getUser(req.headers.authorization),
        };
    },
});

server.listen().then(({ url }) => {
    console.log(`✅ Server ready at ${url}`);
});
