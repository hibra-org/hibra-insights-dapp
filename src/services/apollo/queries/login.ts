import { graphql } from '@/__generated__/gql';

const POST_LOGIN = graphql(`
  mutation PostLogin($wallet: String, $walletAddress: String, $chain: String) {
    postLogin(wallet: $wallet, walletAddress: $walletAddress, chain: $chain) {
      id
    }
  }
`);

export { POST_LOGIN };
