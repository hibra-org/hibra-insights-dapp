import { makeExecutableSchema } from '@graphql-tools/schema';

import { loginResolvers, pingResolvers, settingResolvers } from './resolvers';
import { loginTypeDefs, pingTypeDefs, settingTypeDefs } from './type-defs';

export const schema = makeExecutableSchema({
  typeDefs: [loginTypeDefs, pingTypeDefs, settingTypeDefs],
  resolvers: [loginResolvers, pingResolvers, settingResolvers],
});
