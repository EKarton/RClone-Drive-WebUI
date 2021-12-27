import { useHistory } from 'react-router-dom';
import RemotesListSection from 'components/RemotesListSection';
import { hashRemotePath } from 'utils/remote-paths-url';
import './index.scss';

export default function FilesPage() {
  const history = useHistory();

  const handleRemoteCardClicked = (remote) => {
    history.push(`/files/${hashRemotePath(`${remote}:`)}`);
  };

  return (
    <div className="files-page">
      <RemotesListSection onRemoteCardClicked={handleRemoteCardClicked} />
    </div>
  );
}
