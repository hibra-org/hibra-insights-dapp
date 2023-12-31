import { graphql } from '@/__generated__/gql';

const GET_PORTFOLIO = graphql(`
  query Query {
    getPortfolio {
      binanceBalances {
        asset
        free
        locked
        avgBuyPrice
      }
      binanceSnapshots {
        updateTime
        totalAssetOfUsd
        totalAssetOfBtc
        balances {
          asset
          free
          locked
        }
      }
    }
  }
`);

export { GET_PORTFOLIO };
