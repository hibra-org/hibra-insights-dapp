import {
  MutationPostExchangeArgs,
  PostExchange,
} from '@/__generated__/graphql';
import { Context } from '@/pages/api/graphql';
import { ExchangeId } from '@/utils/constants';
import { loginMiddleware } from '@/utils/helpers/auth.helper';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

const settingResolvers = {
  Query: {
    getSetting: async (_: unknown, __: any, context: Context) => {
      try {
        const auth = context.auth;
        const prisma = context.prisma;

        const walletAddress = await loginMiddleware(auth);

        if (!walletAddress) {
          throw new GraphQLError('Not found wallet address!', {
            extensions: {
              code: ApolloServerErrorCode.GRAPHQL_PARSE_FAILED,
            },
          });
        }

        const user = await prisma.user.findUnique({
          where: {
            walletAddress,
          },
          include: {
            ExchangeDetail: true,
          },
        });

        if (!user?.id) {
          throw new GraphQLError('Not found user!');
        }

        return {
          exchange: user.ExchangeDetail,
        };
      } catch (e) {
        throw e;
      }
    },
  },

  Mutation: {
    postExchange: async (
      _: unknown,
      args: MutationPostExchangeArgs,
      context: Context,
    ): Promise<PostExchange> => {
      try {
        const auth = context.auth;
        const prisma = context.prisma;

        const walletAddress = await loginMiddleware(auth);

        if (!walletAddress) {
          throw new GraphQLError('Not found wallet address!', {
            extensions: {
              code: ApolloServerErrorCode.GRAPHQL_PARSE_FAILED,
            },
          });
        }

        const user = await prisma.user.findUnique({
          select: {
            id: true,
          },
          where: {
            walletAddress,
          },
        });

        if (!user?.id) {
          throw new GraphQLError('Not found user!');
        }

        const data = [];

        data?.push({
          exchangeId: ExchangeId.BINANCE,
          userId: user.id,
          walletAddress,
          apiKey: args.binanceApiKey,
        });

        data?.push({
          exchangeId: ExchangeId.OKX,
          userId: user.id,
          walletAddress,
          apiKey: args.binanceApiKey,
        });

        if (data?.length > 0) {
          const stack: any[] = [];
          data.forEach((item) => {
            stack.push(
              prisma.exchangeDetail.upsert({
                create: {
                  exchangeId: item.exchangeId,
                  userId: item.userId,
                  walletAddress: item.walletAddress,
                  apiKey: item.apiKey,
                },
                update: {
                  apiKey: item.apiKey,
                },
                where: {
                  exchangeId: item.exchangeId,
                  userId: item.userId,
                },
              }),
            );
          });

          await prisma.$transaction(stack);
        }

        return {
          binanceApiKey: args?.binanceApiKey,
          okxApiKey: args?.okxApiKey,
        };
      } catch (e) {
        throw e;
      }
    },
  },
};

export { settingResolvers };
