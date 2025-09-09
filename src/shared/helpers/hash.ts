import * as crypto from 'node:crypto';

export const createSHA256 = (str: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(str).digest('hex');
};
