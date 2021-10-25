import RCloneClient from "utils/RCloneClient";
import useRCloneInfo from "./useRCloneInfo";

export default function useRCloneClient() {
  const { rCloneInfo } = useRCloneInfo();

  if (!rCloneInfo.endpoint || !rCloneInfo.username || !rCloneInfo.password) {
    throw new MissingRCloneInfoError();
  }

  return new RCloneClient(
    rCloneInfo.endpoint,
    rCloneInfo.username,
    rCloneInfo.password
  );
}

export class MissingRCloneInfoError extends Error {
  constructor() {
    super("Missing RClone info!");
  }
}
