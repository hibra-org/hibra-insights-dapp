import { gql } from '@apollo/client';

const loginTypeDefs = gql`
  type PostLogin {
    access_token: String!
    refresh_token: String!
  }

  type Mutation {
    postLogin(
      accountId: String!
      publicKey: String!
      signature: String!
      nonce: String!
    ): PostLogin
  }
`;

export { loginTypeDefs };
