import { Button } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import useRCloneClient from "hooks/useRCloneClient";
import FolderBrowserDialog from "./FolderBrowserDialog";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { hashRemotePath } from "utils/remote-paths-url";

const PicturesPage = () => {
  const history = useHistory();
  const rCloneClient = useRCloneClient();
  const [remotes, setRemotes] = useState();

  const [selectedRemote, setSelectedRemote] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await rCloneClient.fetchRemotes();
      setRemotes(data.sort());
    };

    fetchData();
  }, [rCloneClient]);

  if (!remotes) {
    return null;
  }

  const handleButtonClick = (remote) => () => {
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
    <div className="filespage">
      {isDialogOpen && (
        <FolderBrowserDialog
          title={renderFolderDialogTitle()}
          remotes={[selectedRemote]}
          open={isDialogOpen}
          onCancel={handleFolderDialogCancelled}
          onOk={handleFolderDialogSelected}
        />
      )}
      {remotes.sort().map((remote) => (
        <div>
          <Button
            variant="outlined"
            startIcon={<StorageIcon />}
            onClick={handleButtonClick(remote)}
          >
            {remote}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PicturesPage;
