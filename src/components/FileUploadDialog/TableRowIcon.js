import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import Tooltip from '@mui/material/Tooltip';

export default function TableRowIcon({ fileType }) {
  const renderIcon = () => {
    if (fileType === 'application/zip') {
      return <FolderZipIcon />;
    }

    if (fileType.startsWith('text')) {
      return <ArticleIcon />;
    }

    return <DescriptionIcon />;
  };

  return (
    <Tooltip title={fileType} arrow>
      <span>{renderIcon()}</span>
    </Tooltip>
  );
}
