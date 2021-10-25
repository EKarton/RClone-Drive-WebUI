import { Button } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import { useEffect, useState } from "react";
import "./index.scss";
import { useHistory } from "react-router";
import useRCloneClient from "hooks/useRCloneClient";

const FilesPage = () => {
  const history = useHistory();
  const rCloneClient = useRCloneClient();
  const [remotes, setRemotes] = useState(undefined);

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
    const path = `${remote}:`;
    const link = `/files/${Buffer.from(path).toString("base64")}`;

    history.push(link);
  };

  return (
    <div className="filespage">
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

export default FilesPage;
