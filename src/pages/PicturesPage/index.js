import { Button } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import useRCloneClient from "hooks/useRCloneClient";
import FolderBrowserDialog from "./FolderBrowserDialog";
import { useEffect, useState } from "react";

const PicturesPage = () => {
  const rCloneClient = useRCloneClient();
  const [remotes, setRemotes] = useState();

  const [selectedRemote, setSelectedRemote] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await rCloneClient.fetchRemotes();
      setRemotes(data);
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

  const handleFolderBrowserClosed = (selectedFolder) => {
    setIsDialogOpen(false);
  };

  return (
    <div className="filespage">
      {isDialogOpen && (
        <FolderBrowserDialog
          remote={selectedRemote}
          open={isDialogOpen}
          onClose={handleFolderBrowserClosed}
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
