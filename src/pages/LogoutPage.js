import useRCloneInfo from 'hooks/useRCloneInfo';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

export default function LogoutPage() {
  const history = useHistory();
  const { rCloneInfo, clearRCloneInfo } = useRCloneInfo();

  clearRCloneInfo();

  useEffect(() => {
    if (!rCloneInfo.endpoint && !rCloneInfo.password && !rCloneInfo.username) {
      history.push('/');
    }
  }, [rCloneInfo]);

  return <div>Logging out...</div>;
}
