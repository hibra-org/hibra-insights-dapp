import { GetPortfolio } from '@/__generated__/graphql';
import { Context } from '@/pages/api/graphql';
import { ExchangeId } from '@/utils/constants';
import { loginMiddleware } from '@/utils/helpers/auth.helper';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import {
  AccountSnapshotType,
  Interval,
  Spot,
} from '@binance/connector-typescript';
import Big from 'big.js';
import dayjs from 'dayjs';
import { env } from 'env.mjs';
import { GraphQLError } from 'graphql';

const portfolioResolvers = {
  Query: {
    getPortfolio: async (
      _: unknown,
      __: any,
      context: Context,
    ): Promise<GetPortfolio> => {
      try {
        const auth = context.auth;
        const prisma = context.prisma;

        const dailyAccountSnapshotAction = async (
          snapshots: any,
          binancePortfolioId: any,
          client: Spot,
          usdPairLists: string[],
        ) => {
          await Promise.all(
            snapshots.map(async (snapshot: any) => {
              const snapshotUpdateTime = dayjs(
                snapshot.updateTime,
              ).toISOString();

              let totalAssetOfUsd = Big('0');

              await Promise.all(
                snapshot?.data?.balances.map(async (balance: any) => {
                  const allQuantity = Big(balance.free).add(balance.locked);
                  const orgAsset = balance.asset?.replace('LD', '');
                  const symbol = `${orgAsset}USDT`;
                  const isUsdt = orgAsset === 'USDT';
                  const isSupportUsdt = usdPairLists.includes(symbol);

                  if (isSupportUsdt || isUsdt) {
                    const currentPriceOfUsd = isUsdt
                      ? allQuantity
                      : await client.klineCandlestickData(
                          symbol,
                          Interval['1s'],
                          {
                            limit: 1,
                            startTime: snapshot.updateTime,
                            endTime: snapshot.updateTime,
                          },
                        );

                    const avgPriceOfUsd = isUsdt
                      ? Big(String(currentPriceOfUsd))
                      : Big((currentPriceOfUsd as any)?.[0]?.[1] || '1')
                          .add((currentPriceOfUsd as any)?.[0]?.[4] || '1')
                          .div(2);

                    const priceAssetOfUsd = isUsdt
                      ? allQuantity
                      : allQuantity.mul(avgPriceOfUsd);

                    totalAssetOfUsd = Big(priceAssetOfUsd).add(totalAssetOfUsd);
                  }
                  return null;
                }),
              );

              const currentPriceOfBtc = await client.klineCandlestickData(
                'BTCUSDT',
                Interval['1s'],
                {
                  limit: 1,
                  startTime: snapshot.updateTime,
                  endTime: snapshot.updateTime,
                },
              );

              const avgPriceOfBtc = Big(currentPriceOfBtc?.[0]?.[1] || '0')
                .add(currentPriceOfBtc?.[0]?.[4] || '0')
                .div(2);

              const binanceSnapshot = await prisma.binanceSnapshot.create({
                data: {
                  updateTime: snapshotUpdateTime,
                  binancePortfolioId,
                  totalAssetOfUsd: totalAssetOfUsd.toString(),
                  totalAssetOfBtc: Big(
                    totalAssetOfUsd.div(avgPriceOfBtc),
                  ).toString(),
                },
                select: {
                  id: true,
                },
              });

              const snapshotBalances = await Promise.all(
                snapshot.data.balances.map(async (balance: any) => {
                  return {
                    asset: balance.asset,
                    free: balance.free,
                    locked: balance.locked,
                    binanceSnapshotId: binanceSnapshot.id,
                  };
                }),
              );

              const snapshotStack: any[] = [];

              snapshotStack.push(
                prisma.binanceSnapshotBalance.createMany({
                  data: snapshotBalances,
                }),
              );

              await prisma.$transaction(snapshotStack);

              return null;
            }),
          );
        };

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
            exchange: true,
            binancePortfolio: true,
          },
        });

        if (!user?.id) {
          throw new GraphQLError('Not found user!');
        }

        const binanceExChange = user.exchange.find(
          (ex) => ex.exchangeId === ExchangeId.BINANCE,
        );

        let binancePortfolioResponse;
        if (binanceExChange?.apiKey) {
          const client = new Spot(
            binanceExChange.apiKey,
            binanceExChange?.apiSecret || '',
            {
              baseURL: env.BINANCE_BASE_URL,
            },
          );

          const accountInformation = await client.accountInformation();

          const updateTime = dayjs(accountInformation.updateTime).toISOString();

          const stack: any[] = [];

          const binancePortfolio = await prisma.binancePortfolio.upsert({
            select: {
              id: true,
            },
            create: {
              userId: user.id,
              updateTime,
            },
            update: {
              updateTime,
            },
            where: {
              userId: user.id,
            },
          });

          const balances = accountInformation.balances.filter((bl) =>
            Big(bl.free).gt(Big('0') || Big(bl.locked).gt(Big('0'))),
          );

          const exchangeInfo = await client.exchangeInformation({
            permissions: 'SPOT',
          });

          const usdPairLists: string[] = [];

          // Calculate Binance Balance
          if (balances?.length > 0) {
            await Promise.all(
              balances.map(async (bl) => {
                const symbolPairLists: string[] = [];
                const orgAsset = bl.asset?.replace('LD', '');

                exchangeInfo.symbols.forEach((symbol) => {
                  if (symbol.baseAsset === orgAsset) {
                    symbolPairLists.push(symbol.symbol);
                  }
                  if (symbol.quoteAsset === 'USDT') {
                    usdPairLists.push(symbol.symbol);
                  }
                });

                let totalTradeBuyPrice = Big('0');
                let numberOfBuy = 0;

                await Promise.all(
                  symbolPairLists.map(async (symbol) => {
                    const tradeHistory = await client.accountTradeList(symbol);

                    const quoteAsset = symbol.replace(orgAsset, '');

                    const isUsdt = quoteAsset === 'USDT';
                    const isSupportUsdt = usdPairLists.includes(
                      `${quoteAsset}USDT`,
                    );

                    if (isSupportUsdt || isUsdt) {
                      await Promise.all(
                        tradeHistory.map(async (trade) => {
                          const currentPriceOfQuoteAsset = isUsdt
                            ? trade.price
                            : await client.klineCandlestickData(
                                `${quoteAsset}USDT`,
                                Interval['1s'],
                                {
                                  limit: 1,
                                  startTime: trade.time,
                                  endTime: trade.time,
                                },
                              );

                          const avgPriceOfQuoteAsset = isUsdt
                            ? Big(currentPriceOfQuoteAsset as string)
                            : Big(currentPriceOfQuoteAsset?.[0]?.[1] || '0')
                                .add(currentPriceOfQuoteAsset?.[0]?.[4] || '0')
                                .div(2);

                          const tradeBuyPrice = isUsdt
                            ? Big(currentPriceOfQuoteAsset as string)
                            : Big(trade.quoteQty).mul(avgPriceOfQuoteAsset);

                          if (trade.isBuyer) {
                            numberOfBuy += 1;
                            totalTradeBuyPrice =
                              totalTradeBuyPrice.add(tradeBuyPrice);
                          }

                          return null;
                        }),
                      );
                    }
                    return null;
                  }),
                );

                const avgTotalTradeBuyPrice =
                  numberOfBuy === 0
                    ? '0'
                    : totalTradeBuyPrice.div(String(numberOfBuy));

                stack.push(
                  prisma.binanceBalance.upsert({
                    create: {
                      asset: bl.asset,
                      free: bl.free,
                      locked: bl.locked,
                      binancePortfolioId: binancePortfolio.id,
                      avgBuyPrice: avgTotalTradeBuyPrice.toString(),
                    },
                    update: {
                      free: bl.free,
                      locked: bl.locked,
                      avgBuyPrice: avgTotalTradeBuyPrice.toString(),
                    },
                    where: {
                      asset: bl.asset,
                      binancePortfolioId: binancePortfolio.id,
                    },
                  }),
                );
              }),
            );
          }

          const binanceSnapshot = await prisma.binanceSnapshot.findFirst({
            where: {
              binancePortfolioId: binancePortfolio.id,
            },
            select: {
              id: true,
              updateTime: true,
            },
            orderBy: {
              updateTime: 'desc',
            },
          });

          if (!binanceSnapshot?.id) {
            // if not found snapshot, get all snapshot
            const dailyAccountSnapshot = await client.dailyAccountSnapshot(
              AccountSnapshotType.SPOT,
              { limit: 30 },
            );

            if (dailyAccountSnapshot.snapshotVos?.length > 0) {
              await dailyAccountSnapshotAction(
                dailyAccountSnapshot.snapshotVos,
                binancePortfolio.id,
                client,
                usdPairLists,
              );
            }
          } else {
            // if found snapshot, get snapshot from last snapshot
            const distanceTime = dayjs().diff(
              binanceSnapshot.updateTime,
              'day',
            );

            if (distanceTime > 1) {
              const dailyAccountSnapshot = await client.dailyAccountSnapshot(
                AccountSnapshotType.SPOT,
                {
                  startTime: dayjs(binanceSnapshot.updateTime)
                    .add(1, 's')
                    .valueOf(),
                  endTime: dayjs(binanceSnapshot.updateTime)
                    .add(distanceTime - 1, 'd')
                    .valueOf(),
                },
              );

              if (dailyAccountSnapshot.snapshotVos?.length > 0) {
                await dailyAccountSnapshotAction(
                  dailyAccountSnapshot.snapshotVos,
                  binancePortfolio.id,
                  client,
                  usdPairLists,
                );
              }
            }
          }

          await prisma.$transaction(stack);

          binancePortfolioResponse = await prisma.binancePortfolio.findUnique({
            where: {
              id: binancePortfolio?.id,
            },
            include: {
              balances: true,
              snapshots: {
                select: {
                  updateTime: true,
                  balances: true,
                  totalAssetOfUsd: true,
                  totalAssetOfBtc: true,
                },
                orderBy: {
                  updateTime: 'asc',
                },
              },
            },
          });
        }

        return {
          binanceBalances: binancePortfolioResponse?.balances || [],
          binanceSnapshots: (binancePortfolioResponse?.snapshots as any) || [],
        };
      } catch (e) {
        throw e;
      }
    },
  },
};

export { portfolioResolvers };
