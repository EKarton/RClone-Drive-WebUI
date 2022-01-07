import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import Icon from '@mui/material/Icon';
import PropTypes from 'prop-types';
import LazyImage from 'components/LazyImage';
import { ICON_SIZE } from 'utils/constants';
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
            dirPath: file.path,
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

FileIcon.propTypes = {
  file: PropTypes.shape({
    isDirectory: PropTypes.bool.isRequired,
    isImage: PropTypes.bool.isRequired,
  }),
  iconSize: PropTypes.oneOf(Object.values(ICON_SIZE)),
  showPreview: PropTypes.bool,
};
