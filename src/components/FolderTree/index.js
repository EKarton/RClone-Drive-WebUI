import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeView from '@mui/lab/TreeView';
import PropTypes from 'prop-types';
import FolderTreeItem from './FolderTreeItem';

export default function FolderTree({ remotes, onSelect }) {
  const handleNodeSelect = (_e, nodeIds) => {
    onSelect(nodeIds);
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

FolderTreeItem.propTypes = {
  remotes: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
};
