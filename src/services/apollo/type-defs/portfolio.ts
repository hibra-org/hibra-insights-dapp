import { gql } from '@apollo/client';

const portfolioTypeDefs = gql`
  type BinanceBalance {
    asset: String
    free: String
    locked: String
    avgBuyPrice: String
  }

  type BinanceSnapshot {
    updateTime: String
    balances: [BinanceBalance]
    totalAssetOfUsd: String
    totalAssetOfBtc: String
  }

  type GetPortfolio {
    binanceBalances: [BinanceBalance]
    binanceSnapshots: [BinanceSnapshot]
  }

  type Query {
    getPortfolio: GetPortfolio
  }
`;

export { portfolioTypeDefs };
