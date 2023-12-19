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
      }
    }
  }
`);

const POST_EXCHANGE = graphql(`
  mutation Mutation($binanceApiKey: String, $okxApiKey: String) {
    postExchange(binanceApiKey: $binanceApiKey, okxApiKey: $okxApiKey) {
      binanceApiKey
      okxApiKey
    }
  }
`);

export { GET_SETTING, POST_EXCHANGE };
