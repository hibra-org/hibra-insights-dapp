import { makeExecutableSchema } from '@graphql-tools/schema';

import { loginResolvers, todoResolvers } from './resolvers';
import { loginTypeDefs, todoTypeDefs } from './type-defs';

export const schema = makeExecutableSchema({
  typeDefs: [todoTypeDefs, loginTypeDefs],
  resolvers: [todoResolvers, loginResolvers],
});
