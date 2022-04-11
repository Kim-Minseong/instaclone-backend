import { ApolloServer } from 'apollo-server';
import 'dotenv/config';

import { typeDefs, resolvers } from './schema';

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`✅ Server ready at ${url}`);
});
