import { MutationPostLoginArgs, PostLogin } from '@/__generated__/graphql';
import { SIGN_MESSAGE } from '@/components/features/login/login.constant';
import { NEAR_RPC_API } from '@/utils/constants/near-api.constant';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import {
  verifyFullKeyBelongsToUser,
  verifySignature,
} from '@near-wallet-selector/core';
import { env } from 'env.mjs';
import jwt from 'jsonwebtoken';

const loginResolvers = {
  Mutation: {
    postLogin: async (_: unknown, args: MutationPostLoginArgs) => {
      const validSignature = verifySignature({
        publicKey: args.publicKey,
        message: SIGN_MESSAGE,
        nonce: Uint8Array.from(Buffer.from(JSON.parse(args.nonce))) as Buffer,
        recipient: env.NEXT_PUBLIC_CONTRACT_ID,
        signature: args.signature,
      });

      const fullKeyOfUser = await verifyFullKeyBelongsToUser({
        accountId: args.accountId,
        publicKey: args.publicKey,
        network: {
          explorerUrl: NEAR_RPC_API.TESTNET.EXPLORER_URL,
          indexerUrl: '',
          nodeUrl: NEAR_RPC_API.TESTNET.NODE_URL,
          networkId: NEAR_RPC_API.TESTNET.NETWORK_ID,
          helperUrl: '',
        },
      });

      const isVerified = validSignature && fullKeyOfUser;

      if (isVerified) {
        const payload = {
          data: { user: 'test' },
        };

        const access_token = jwt.sign(payload, env.JWT_SECRET, {
          expiresIn: 60 * 5,
        });
        const refresh_token = jwt.sign(payload, env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24 * 7,
        });

        const response: PostLogin = {
          access_token,
          refresh_token,
        };

        return response;
      }

      throw ApolloServerErrorCode.BAD_REQUEST;
    },
  },
};

export { loginResolvers };
