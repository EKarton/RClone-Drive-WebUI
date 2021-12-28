import { Buffer } from 'buffer';

export const hashRemotePath = (remotePath) => {
  return Buffer.from(remotePath).toString('base64');
};

export const unhashRemotePath = (hashedRemotePath) => {
  return Buffer.from(hashedRemotePath, 'base64').toString('utf-8');
};
