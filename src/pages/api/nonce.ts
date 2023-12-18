import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = string;

// eslint-disable-next-line import/no-unused-modules
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  res.status(200).send(result);
}
