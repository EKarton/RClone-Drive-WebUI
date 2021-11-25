import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useRCloneClient from 'hooks/useRCloneClient';
import { useEffect, useState } from 'react';
import { StatusTypes } from 'utils/constants';

export default function FolderTreeItem({ remote, curPath, label }) {
  const rCloneClient = useRCloneClient();

  const [status, setStatus] = useState(null);
  const [subFolders, setSubFolders] = useState();
  const [error, setError] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setStatus(StatusTypes.LOADING);
        setError(null);

        const data = await rCloneClient.fetchSubFolders(remote, curPath);

        setSubFolders(data.sort());
        setStatus(StatusTypes.SUCCESS);
      } catch (err) {
        setError(err);
        setStatus(StatusTypes.ERROR);
      }
    };

    if (isExpanded) {
      fetchFolders();
    }
  }, [curPath, isExpanded, rCloneClient, remote]);

  const handleTreeItemClicked = () => {
    setIsExpanded(true);
  };

  const renderSubFolders = () => {
    if (!isExpanded || !status) {
      return <div />;
    }

    if (status === StatusTypes.LOADING) {
      return <div>Loading</div>;
    }

    if (status === StatusTypes.ERROR) {
      return <div>Error!</div>;
    }

    if (subFolders.length === 0) {
      return <div>No subfolders</div>;
    }

    return subFolders.map((subFolder) => (
      <FolderTreeItem
        remote={remote}
        curPath={subFolder.Path}
        label={subFolder.Name}
        key={subFolder.Name}
      />
    ));
  };

  return (
    <TreeItem
      nodeId={`${remote}:${curPath}`}
      label={label}
      onClick={handleTreeItemClicked}
      expandIcon={<ChevronRightIcon />}
      collapseIcon={<ExpandMoreIcon />}
    >
      {renderSubFolders()}
    </TreeItem>
  );
}
