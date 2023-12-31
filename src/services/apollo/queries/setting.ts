import { graphql } from '@/__generated__/gql';

const GET_SETTING = graphql(`
  query GetSetting {
    getSetting {
      exchange {
        id
        exchangeId
        userId
        walletAddress
        apiKey
        apiSecret
      }
    }
  }
`);

const POST_EXCHANGE = graphql(`
  mutation Mutation(
    $binanceApiKey: String
    $binanceApiSecret: String
    $okxApiKey: String
  ) {
    postExchange(
      binanceApiKey: $binanceApiKey
      binanceApiSecret: $binanceApiSecret
      okxApiKey: $okxApiKey
    ) {
      binanceApiKey
      binanceApiSecret
      okxApiKey
    }
  }
`);

export { GET_SETTING, POST_EXCHANGE };
