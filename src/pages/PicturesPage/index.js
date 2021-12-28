import { useState } from 'react';
import { useNavigate } from 'react-router';
import RemotesListSection from 'components/RemotesListSection';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog/index';
import { hashRemotePath } from 'utils/remote-paths-url';
import FolderBrowserDialog from './FolderBrowserDialog';
import RecentPicturesSection from './RecentPicturesSection';
import './index.scss';

/**
 * Represents the Pictures page with the list of remotes
 */
export default function PicturesPage() {
  const navigate = useNavigate();

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
    navigate(`/pictures/${hashRemotePath(remotePath)}`);
    setIsDialogOpen(false);
  };

  return (
    <FileViewerDialogProvider>
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
    </FileViewerDialogProvider>
  );
}
