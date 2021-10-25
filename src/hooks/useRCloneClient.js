import { useMemo } from "react";
import RCloneClient from "utils/RCloneClient";
import useRCloneInfo from "./useRCloneInfo";

export default function useRCloneClient() {
  const { rCloneInfo } = useRCloneInfo();

  if (!rCloneInfo.endpoint || !rCloneInfo.username || !rCloneInfo.password) {
    throw new MissingRCloneInfoError();
  }

  const client = useMemo(() => {
    return new RCloneClient(
      rCloneInfo.endpoint,
      rCloneInfo.username,
      rCloneInfo.password
    );
  }, [rCloneInfo.endpoint, rCloneInfo.username, rCloneInfo.password]);

  return client;
}

export class MissingRCloneInfoError extends Error {
  constructor() {
    super("Missing RClone info!");
  }
}
