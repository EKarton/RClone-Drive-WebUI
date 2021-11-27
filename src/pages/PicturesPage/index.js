import FolderBrowserDialog from './FolderBrowserDialog';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { hashRemotePath } from 'utils/remote-paths-url';
import RecentlyViewedImages from './RecentlyViewedImages';
import RemotesListSection from './RemotesListSection';
import './index.scss';

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

  const handleFolderDialogSelected = (selectedRemotePath) => {
    if (selectedRemotePath) {
      history.push(`/pictures/${hashRemotePath(selectedRemotePath)}`);
    }
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
      <RecentlyViewedImages />
      <RemotesListSection onRemoteCardClicked={handleRemoteCardClicked} />
    </div>
  );
}
