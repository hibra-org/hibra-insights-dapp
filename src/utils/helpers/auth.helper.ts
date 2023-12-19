import bcrypt from 'bcryptjs';
import { env } from 'env.mjs';
import { GraphQLError } from 'graphql';
import { JwtPayload, verify } from 'jsonwebtoken';

import { SALT } from '../constants';

const hashBcrypt = async (str: string): Promise<string> => {
  const hash = await bcrypt.hash(str, SALT);
  return hash;
};

const verifyBcrypt = async (str: string, hash: string): Promise<boolean> => {
  const result = await bcrypt.compare(str, hash);
  return result;
};

const loginMiddleware = (auth: string) => {
  if (!auth) {
    throw new GraphQLError('Please login to be continue!');
  }

  const decode = verify(auth, env.PUBLIC_KEY) as JwtPayload;

  const walletAddress = decode?.verified_credentials?.[0]?.address || '';
  return walletAddress;
};

export { hashBcrypt, verifyBcrypt, loginMiddleware };
