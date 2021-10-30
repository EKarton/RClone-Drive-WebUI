import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useRCloneClient from "hooks/useRCloneClient";
import { useEffect, useState } from "react";
import { StatusTypes } from "pages/PicturesListPage";

const FolderTree = ({ remotes, onFolderSelect }) => {
  const handleNodeSelect = (_e, nodeIds) => {
    onFolderSelect(nodeIds);
  };

  return (
    <TreeView
      aria-label="file tree navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleNodeSelect}
    >
      {remotes.map((remote) => (
        <FolderTreeItem remote={remote} curPath="" label={remote} />
      ))}
    </TreeView>
  );
};

const FolderTreeItem = ({ remote, curPath, label }) => {
  const rCloneClient = useRCloneClient();

  const [status, setStatus] = useState(StatusTypes.LOADING);
  const [subFolders, setSubFolders] = useState(undefined);
  const [error, setError] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setError(null);
        setStatus(StatusTypes.LOADING);

        const data = await rCloneClient.fetchSubFolders(remote, curPath);

        setSubFolders(data.sort());
        setStatus(StatusTypes.SUCCESS);
      } catch (err) {
        setError(err);
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
    if (!isExpanded) {
      return <div />;
    }

    if (status === StatusTypes.LOADING) {
      return <div>Loading</div>;
    }

    if (status === StatusTypes.ERROR) {
      return <div>Error! {error}</div>;
    }

    if (subFolders.length === 0) {
      return <div>No subfolders</div>;
    }

    return subFolders.map((subFolder) => (
      <FolderTreeItem
        remote={remote}
        curPath={subFolder.Path}
        label={subFolder.Name}
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
};

export default FolderTree;
