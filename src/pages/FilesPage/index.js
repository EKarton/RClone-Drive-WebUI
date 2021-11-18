import { Button } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { useEffect, useState } from 'react';
import './index.scss';
import { useHistory } from 'react-router';
import useRCloneClient from 'hooks/useRCloneClient';
import { hashRemotePath } from 'utils/remote-paths-url';

export default function FilesPage() {
  const history = useHistory();
  const rCloneClient = useRCloneClient();

  const [remotes, setRemotes] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await rCloneClient.fetchRemotes();

        setRemotes(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [rCloneClient]);

  if (!remotes && !error) {
    return null;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const handleButtonClick = (remote) => () => {
    history.push(`/files/${hashRemotePath(`${remote}:`)}`);
  };

  return (
    <div className="filespage">
      {remotes.sort().map((remote) => (
        <div key={remote}>
          <Button
            variant="outlined"
            startIcon={<StorageIcon />}
            onClick={handleButtonClick(remote)}
            data-testid={remote}
          >
            {remote}
          </Button>
        </div>
      ))}
    </div>
  );
}
