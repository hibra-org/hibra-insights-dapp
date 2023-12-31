import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  loginResolvers,
  pingResolvers,
  portfolioResolvers,
  settingResolvers,
} from './resolvers';
import {
  loginTypeDefs,
  pingTypeDefs,
  portfolioTypeDefs,
  settingTypeDefs,
} from './type-defs';

export const schema = makeExecutableSchema({
  typeDefs: [loginTypeDefs, pingTypeDefs, settingTypeDefs, portfolioTypeDefs],
  resolvers: [
    loginResolvers,
    pingResolvers,
    settingResolvers,
    portfolioResolvers,
  ],
});
