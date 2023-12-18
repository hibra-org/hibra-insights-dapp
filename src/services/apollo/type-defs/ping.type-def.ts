import { gql } from '@apollo/client';

const pingTypeDefs = gql`
  type Ping {
    status: Boolean
  }

  type Query {
    ping: Ping
  }
`;

export { pingTypeDefs };
