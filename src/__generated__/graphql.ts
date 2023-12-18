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

export type Mutation = {
  __typename?: 'Mutation';
  postLogin?: Maybe<PostLogin>;
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

export type PostLogin = {
  __typename?: 'PostLogin';
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
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
