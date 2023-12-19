import React from 'react';
import { POST_LOGIN } from '@/adapters/login.adapter';
import { useMutation } from '@apollo/client';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';
import { env } from 'env.mjs';

function DynamicProvider({ children }: any) {
  const [postLogin] = useMutation(POST_LOGIN);

  return (
    <DynamicContextProvider
      settings={{
        environmentId: env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [SolanaWalletConnectors],
        newToWeb3WalletChainMap: {
          primary_chain: 'evm',
          wallets: {
            evm: 'phantomevm',
            solana: 'phantom',
          },
        },
        eventsCallbacks: {
          onAuthSuccess: async (args) => {
            const user = args.user;

            const data = {
              wallet: user.wallet,
              walletAddress: args.primaryWallet?.address,
              chain: args.primaryWallet?.chain,
            };

            try {
              await postLogin({ variables: data });
            } catch {
              //
            }
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}

export { DynamicProvider };
