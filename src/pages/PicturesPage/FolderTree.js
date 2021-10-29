import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useRCloneClient from "hooks/useRCloneClient";
import { useEffect, useState } from "react";
import { StatusTypes } from "pages/PicturesListPage";

const FolderTree = ({ remote, onFolderSelect }) => {
  const handleNodeSelect = (e, nodeIds) => {
    onFolderSelect(nodeIds);
  };

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleNodeSelect}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      <FolderTreeItem
        remote={remote}
        curPath=""
        label="/"
        loadSubFoldersImmediately
      />
    </TreeView>
  );
};

const FolderTreeItem = ({
  remote,
  curPath,
  label,
  loadSubFoldersImmediately,
}) => {
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

        setSubFolders(data);
        setStatus(StatusTypes.SUCCESS);
      } catch (err) {
        setError(err);
      }
    };

    if (isExpanded || loadSubFoldersImmediately) {
      fetchFolders();
    }
  }, [curPath, isExpanded, loadSubFoldersImmediately, rCloneClient, remote]);

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
      nodeId={curPath}
      label={label}
      onClick={handleTreeItemClicked}
      expandIcon={<ChevronRightIcon />}
      collapseIcon={<ExpandMoreIcon />}
    >
      {renderSubFolders()}
    </TreeItem>
  );
};

FolderTreeItem.defaultProps = {
  loadSubFoldersImmediately: false,
};

export default FolderTree;
