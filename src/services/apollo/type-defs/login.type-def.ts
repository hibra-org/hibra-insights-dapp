import { gql } from '@apollo/client';

const loginTypeDefs = gql`
  type PostLogin {
    id: ID!
  }

  type Mutation {
    postLogin(wallet: String, walletAddress: String, chain: String): PostLogin
  }
`;

export { loginTypeDefs };
