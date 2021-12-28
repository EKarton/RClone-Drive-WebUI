import { useNavigate } from 'react-router-dom';
import RemotesListSection from 'components/RemotesListSection';
import { hashRemotePath } from 'utils/remote-paths-url';
import './index.scss';

export default function FilesPage() {
  const navigate = useNavigate();

  const handleRemoteCardClicked = (remote) => {
    navigate(`/files/${hashRemotePath(`${remote}:`)}`);
  };

  return (
    <div className="files-page">
      <RemotesListSection onRemoteCardClicked={handleRemoteCardClicked} />
    </div>
  );
}
