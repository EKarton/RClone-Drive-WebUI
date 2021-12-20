import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderTreeItem from './FolderTreeItem';

export default function FolderTree({ remotes, onSelect }) {
  const handleNodeSelect = (_e, nodeIds) => {
    if (!nodeIds) {
      return;
    }

    const [remote, folderPath] = nodeIds.split(':');
    onSelect({ remote, folderPath });
  };

  return (
    <TreeView
      aria-label="file tree navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleNodeSelect}
    >
      {remotes.map((remote) => (
        <FolderTreeItem remote={remote} curPath="" label={remote} key={remote} />
      ))}
    </TreeView>
  );
}
