import FolderBrowserDialog from './FolderBrowserDialog';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { hashRemotePath } from 'utils/remote-paths-url';
import RecentPicturesSection from './RecentPicturesSection';
import RemotesListSection from './RemotesListSection';
import './index.scss';

/**
 * Represents the Pictures page with the list of remotes
 */
export default function PicturesPage() {
  const history = useHistory();

  const [selectedRemote, setSelectedRemote] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemoteCardClicked = (remote) => {
    setSelectedRemote(remote);
    setIsDialogOpen(true);
  };

  const renderFolderDialogTitle = () => (
    <>
      Select which folder to view pictures on <strong>{selectedRemote}</strong>
    </>
  );

  const handleFolderDialogCancelled = () => {
    setIsDialogOpen(false);
  };

  const handleFolderDialogSelected = (remotePath) => {
    history.push(`/pictures/${hashRemotePath(remotePath)}`);
    setIsDialogOpen(false);
  };

  return (
    <div className="pictures-page">
      <FolderBrowserDialog
        title={renderFolderDialogTitle()}
        remotes={[selectedRemote]}
        open={isDialogOpen}
        onCancel={handleFolderDialogCancelled}
        onOk={handleFolderDialogSelected}
      />
      <RecentPicturesSection />
      <RemotesListSection onRemoteCardClicked={handleRemoteCardClicked} />
    </div>
  );
}
