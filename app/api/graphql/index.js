import { ApolloServer } from 'apollo-server-micro';
import typeDefs from './schema';
import resolvers from './resolvers';
import connectDB from '../../../config/db';

connectDB();

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
