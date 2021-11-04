import useRCloneInfo from 'hooks/useRCloneInfo';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

export default function LogoutPage() {
  const history = useHistory();
  const { rCloneInfo, clearRCloneInfo } = useRCloneInfo();

  useEffect(() => {
    clearRCloneInfo();

    if (!rCloneInfo.endpoint && !rCloneInfo.password && !rCloneInfo.username) {
      history.push('/');
    }
  }, [clearRCloneInfo, history, rCloneInfo]);

  return <div>Logging out...</div>;
}
