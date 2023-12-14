import { AxiosResponse } from 'axios';

export function parseJWT(token: string) {
  const tokenParsed = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  return tokenParsed;
}

export function titleCase(str: string) {
  return str
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(' ');
}
