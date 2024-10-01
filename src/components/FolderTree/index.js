import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import PropTypes from 'prop-types';
import FolderTreeItem from './FolderTreeItem';

export default function FolderTree({ remotes, onSelect }) {
  const handleNodeSelect = (_e, nodeIds) => {
    onSelect(nodeIds);
  };

  return (
    <SimpleTreeView
      aria-label="file tree navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onItemClick={handleNodeSelect}
    >
      {remotes.map((remote) => (
        <FolderTreeItem remote={remote} curPath="" label={remote} key={remote} />
      ))}
    </SimpleTreeView>
  );
}

FolderTreeItem.propTypes = {
  remotes: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
};
