import { AxiosResponse } from 'axios';

export function parseJWT(token: string) {
  const tokenParsed = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  return tokenParsed;
}
