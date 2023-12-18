import { makeExecutableSchema } from '@graphql-tools/schema';

import { loginResolvers, pingResolvers } from './resolvers';
import { loginTypeDefs, pingTypeDefs } from './type-defs';

export const schema = makeExecutableSchema({
  typeDefs: [loginTypeDefs, pingTypeDefs],
  resolvers: [loginResolvers, pingResolvers],
});
