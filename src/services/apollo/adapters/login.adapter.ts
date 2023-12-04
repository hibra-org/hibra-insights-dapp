import { graphql } from '@/__generated__/gql';

const POST_LOGIN = graphql(`
  mutation PostLogin(
    $accountId: String!
    $publicKey: String!
    $signature: String!
    $nonce: String!
  ) {
    postLogin(
      accountId: $accountId
      publicKey: $publicKey
      signature: $signature
      nonce: $nonce
    ) {
      access_token
      refresh_token
    }
  }
`);

export { POST_LOGIN };
