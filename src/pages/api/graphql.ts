import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/services/prisma/client';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '@prisma/client';
import { schema } from '@services/apollo/schema';

export type Context = {
  prisma: PrismaClient;
  req: NextApiRequest;
  res: NextApiResponse;
  auth: string | null;
};

const apolloServer = new ApolloServer({
  schema,
  plugins:
    process.env.NODE_ENV === 'production'
      ? [ApolloServerPluginLandingPageDisabled()]
      : undefined,
});

// eslint-disable-next-line import/no-unused-modules
export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res): Promise<Context> => {
    const auth = req.headers.authorization?.split(' ')?.[1] || null;

    return {
      prisma,
      req,
      res,
      auth,
    };
  },
});
