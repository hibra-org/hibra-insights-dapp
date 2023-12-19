import { useMemo } from 'react';
import { getSweetErrorConfig } from '@/utils/helpers/common.helper';
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { SchemaLink } from '@apollo/client/link/schema';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import merge from 'deepmerge';
import Swal from 'sweetalert2';

import { schema } from './schema';

let apolloClient: ApolloClient<NormalizedCacheObject>;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && graphQLErrors.length > 0) {
    graphQLErrors.forEach(({ message }) => {
      Swal.fire(getSweetErrorConfig(message));
    });
  }
  if ((!graphQLErrors || graphQLErrors.length === 0) && networkError) {
    Swal.fire(getSweetErrorConfig(networkError.message));
  }
});

function createIsomorphLink() {
  if (typeof window === 'undefined') {
    return new SchemaLink({ schema });
  } else {
    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    });
  }
}

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${getAuthToken() || ''}`,
    },
  };
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, authLink.concat(createIsomorphLink())]),
    cache: new InMemoryCache(),
  });
}

function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}

export { initializeApollo, useApollo };
