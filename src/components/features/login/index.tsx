import { randomBytes } from 'crypto';
import React from 'react';
import { PostLoginMutationVariables } from '@/__generated__/graphql';
import { POST_LOGIN } from '@/services/apollo/adapters/login.adapter';
import { COOKIE_KEYS } from '@/utils/constants/common.constant';
import { LoginOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { App, Button } from 'antd';
import { getCookie } from 'cookies-next';
import { env } from 'env.mjs';

import { SIGN_MESSAGE } from './login.constant';
import { useWalletSelector } from './wallet-selector.context';

const challenge = randomBytes(32);

function LoginFeature() {
  const { modal, selector, accountId } = useWalletSelector();
  const { notification } = App.useApp();

  const authCookie = getCookie(COOKIE_KEYS.AUTH);
  const isSignedIn = accountId && selector?.isSignedIn() && !authCookie;

  const [postLogin, { loading }] = useMutation(POST_LOGIN);

  const signMessage = async () => {
    try {
      const wallet = await selector?.wallet();
      const signature = (await wallet?.signMessage({
        message: SIGN_MESSAGE,
        recipient: env.NEXT_PUBLIC_CONTRACT_ID,
        nonce: challenge,
      })) as PostLoginMutationVariables;

      const params: PostLoginMutationVariables = {
        accountId: signature.accountId,
        publicKey: signature.publicKey,
        signature: signature.signature,
        nonce: JSON.stringify(Buffer.from(challenge).toJSON()),
      };

      postLogin({ variables: params });
    } catch (e) {
      const err = e as Error;
      notification.error({ message: err.name, description: err.message });
    }
  };

  return (
    <Button
      type="primary"
      icon={<LoginOutlined />}
      loading={loading}
      onClick={isSignedIn ? () => signMessage() : () => modal.show()}
    >
      {isSignedIn ? 'Sign message' : 'Login'}
    </Button>
  );
}

export default LoginFeature;
