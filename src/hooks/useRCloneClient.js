import RCloneClient from 'utils/RCloneClient';
import useRCloneInfo from './useRCloneInfo';

let rCloneInstance = null;

export default function useRCloneClient() {
  const { rCloneInfo } = useRCloneInfo();

  if (!rCloneInfo.endpoint || !rCloneInfo.username || !rCloneInfo.password) {
    throw new MissingRCloneInfoError();
  }

  if (rCloneInstance) {
    return rCloneInstance;
  }

  rCloneInstance = new RCloneClient(
    rCloneInfo.endpoint,
    rCloneInfo.username,
    rCloneInfo.password
  );

  return rCloneInstance;
}

export class MissingRCloneInfoError extends Error {
  constructor() {
    super('Missing RClone info!');
  }
}
