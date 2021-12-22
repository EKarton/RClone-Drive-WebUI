import { useEffect } from 'react';
import { useHistory } from 'react-router';
import useRCloneInfo from 'hooks/rclone/useRCloneInfo';

export default function LogoutPage() {
  const history = useHistory();
  const { clearRCloneInfo } = useRCloneInfo();

  useEffect(() => {
    clearRCloneInfo();
    history.push('/');
  }, [clearRCloneInfo, history]);

  return <div>Logging out...</div>;
}
