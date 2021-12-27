import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import Icon from '@mui/material/Icon';
import LazyImage from 'components/LazyImage';
import './FileIcon.scss';

export default function FileIcon({ file, iconSize, showPreview }) {
  if (file.isDirectory) {
    return <FolderIcon fontSize={iconSize} />;
  }

  if (file.isImage && showPreview) {
    return (
      <Icon fontSize={iconSize} className="file-icon__preview-icon">
        <LazyImage
          image={{
            remote: file.remote,
            folderPath: file.path,
            fileName: file.name,
          }}
          imgClassName="file-icon__img"
        />
      </Icon>
    );
  }

  if (file.isImage) {
    return <ImageIcon fontSize={iconSize} />;
  }

  return <DescriptionIcon fontSize={iconSize} />;
}
