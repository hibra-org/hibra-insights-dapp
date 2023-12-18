import { MutationPostLoginArgs } from '@/__generated__/graphql';
import { prisma } from '@/services/prisma/client';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

const loginResolvers = {
  Mutation: {
    postLogin: async (_: unknown, args: MutationPostLoginArgs) => {
      try {
        if (!args?.walletAddress) {
          throw new GraphQLError('Wallet address is required!', {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
            },
          });
        }

        const isExistUser = await prisma.user.findUnique({
          where: { walletAddress: args.walletAddress },
          select: { id: true },
        });

        if (!isExistUser?.id) {
          const user = await prisma.user.create({ data: args as any });
          return {
            id: user.id,
          };
        }

        return {
          id: 0,
        };
      } catch (e) {
        throw e;
      }
    },
  },
};

export { loginResolvers };
