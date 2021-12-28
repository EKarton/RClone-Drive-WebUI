import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRCloneInfo from 'hooks/rclone/useRCloneInfo';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { clearRCloneInfo } = useRCloneInfo();

  useEffect(() => {
    clearRCloneInfo();
    navigate('/');
  }, [clearRCloneInfo, navigate]);

  return <div>Logging out...</div>;
}
