import { gql } from '@apollo/client';

const settingTypeDefs = gql`
  type ExchangeDetail {
    id: Int
    exchangeId: String
    userId: Int
    walletAddress: String
    apiKey: String
    apiSecret: String
  }

  type PostExchange {
    binanceApiKey: String
    binanceApiSecret: String
    okxApiKey: String
  }

  type GetSetting {
    exchange: [ExchangeDetail]
  }

  type Query {
    getSetting: GetSetting
  }

  type Mutation {
    postExchange(
      binanceApiKey: String
      binanceApiSecret: String
      okxApiKey: String
    ): PostExchange
  }
`;

export { settingTypeDefs };
