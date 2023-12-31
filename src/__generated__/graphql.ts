/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type BinanceBalance = {
  __typename?: 'BinanceBalance';
  asset?: Maybe<Scalars['String']['output']>;
  avgBuyPrice?: Maybe<Scalars['String']['output']>;
  free?: Maybe<Scalars['String']['output']>;
  locked?: Maybe<Scalars['String']['output']>;
};

export type BinanceSnapshot = {
  __typename?: 'BinanceSnapshot';
  balances?: Maybe<Array<Maybe<BinanceBalance>>>;
  totalAssetOfBtc?: Maybe<Scalars['String']['output']>;
  totalAssetOfUsd?: Maybe<Scalars['String']['output']>;
  updateTime?: Maybe<Scalars['String']['output']>;
};

export type ExchangeDetail = {
  __typename?: 'ExchangeDetail';
  apiKey?: Maybe<Scalars['String']['output']>;
  apiSecret?: Maybe<Scalars['String']['output']>;
  exchangeId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  userId?: Maybe<Scalars['Int']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

export type GetPortfolio = {
  __typename?: 'GetPortfolio';
  binanceBalances?: Maybe<Array<Maybe<BinanceBalance>>>;
  binanceSnapshots?: Maybe<Array<Maybe<BinanceSnapshot>>>;
};

export type GetSetting = {
  __typename?: 'GetSetting';
  exchange?: Maybe<Array<Maybe<ExchangeDetail>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  postExchange?: Maybe<PostExchange>;
  postLogin?: Maybe<PostLogin>;
};

export type MutationPostExchangeArgs = {
  binanceApiKey?: InputMaybe<Scalars['String']['input']>;
  binanceApiSecret?: InputMaybe<Scalars['String']['input']>;
  okxApiKey?: InputMaybe<Scalars['String']['input']>;
};

export type MutationPostLoginArgs = {
  chain?: InputMaybe<Scalars['String']['input']>;
  wallet?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};

export type Ping = {
  __typename?: 'Ping';
  status?: Maybe<Scalars['Boolean']['output']>;
};

export type PostExchange = {
  __typename?: 'PostExchange';
  binanceApiKey?: Maybe<Scalars['String']['output']>;
  binanceApiSecret?: Maybe<Scalars['String']['output']>;
  okxApiKey?: Maybe<Scalars['String']['output']>;
};

export type PostLogin = {
  __typename?: 'PostLogin';
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  getPortfolio?: Maybe<GetPortfolio>;
  getSetting?: Maybe<GetSetting>;
  ping?: Maybe<Ping>;
};

export type PostLoginMutationVariables = Exact<{
  wallet?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
}>;

export type PostLoginMutation = {
  __typename?: 'Mutation';
  postLogin?: { __typename?: 'PostLogin'; id: string } | null;
};

export type QueryQueryVariables = Exact<{ [key: string]: never }>;

export type QueryQuery = {
  __typename?: 'Query';
  getPortfolio?: {
    __typename?: 'GetPortfolio';
    binanceBalances?: Array<{
      __typename?: 'BinanceBalance';
      asset?: string | null;
      free?: string | null;
      locked?: string | null;
      avgBuyPrice?: string | null;
    } | null> | null;
    binanceSnapshots?: Array<{
      __typename?: 'BinanceSnapshot';
      updateTime?: string | null;
      totalAssetOfUsd?: string | null;
      totalAssetOfBtc?: string | null;
      balances?: Array<{
        __typename?: 'BinanceBalance';
        asset?: string | null;
        free?: string | null;
        locked?: string | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type GetSettingQueryVariables = Exact<{ [key: string]: never }>;

export type GetSettingQuery = {
  __typename?: 'Query';
  getSetting?: {
    __typename?: 'GetSetting';
    exchange?: Array<{
      __typename?: 'ExchangeDetail';
      id?: number | null;
      exchangeId?: string | null;
      userId?: number | null;
      walletAddress?: string | null;
      apiKey?: string | null;
      apiSecret?: string | null;
    } | null> | null;
  } | null;
};

export type MutationMutationVariables = Exact<{
  binanceApiKey?: InputMaybe<Scalars['String']['input']>;
  binanceApiSecret?: InputMaybe<Scalars['String']['input']>;
  okxApiKey?: InputMaybe<Scalars['String']['input']>;
}>;

export type MutationMutation = {
  __typename?: 'Mutation';
  postExchange?: {
    __typename?: 'PostExchange';
    binanceApiKey?: string | null;
    binanceApiSecret?: string | null;
    okxApiKey?: string | null;
  } | null;
};

export const PostLoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'PostLogin' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'wallet' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'walletAddress' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'chain' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'postLogin' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'wallet' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'wallet' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'walletAddress' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'walletAddress' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'chain' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'chain' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PostLoginMutation, PostLoginMutationVariables>;
export const QueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Query' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getPortfolio' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'binanceBalances' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'asset' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'free' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'locked' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avgBuyPrice' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'binanceSnapshots' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateTime' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalAssetOfUsd' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalAssetOfBtc' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'balances' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'asset' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'free' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'locked' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<QueryQuery, QueryQueryVariables>;
export const GetSettingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSetting' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getSetting' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'exchange' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'exchangeId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'walletAddress' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'apiKey' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'apiSecret' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSettingQuery, GetSettingQueryVariables>;
export const MutationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Mutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'binanceApiKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'binanceApiSecret' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'okxApiKey' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'postExchange' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'binanceApiKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'binanceApiKey' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'binanceApiSecret' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'binanceApiSecret' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'okxApiKey' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'okxApiKey' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'binanceApiKey' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'binanceApiSecret' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'okxApiKey' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MutationMutation, MutationMutationVariables>;
