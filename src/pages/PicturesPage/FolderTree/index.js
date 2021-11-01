import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderTreeItem from './FolderTreeItem';

export default function FolderTree({ remotes, onFolderSelect }) {
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
}
