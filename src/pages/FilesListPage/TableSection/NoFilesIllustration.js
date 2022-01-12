import Typography from '@mui/material/Typography';
import NoFilesImage from 'assets/images/illustrations/no-data.svg';
import './NoFilesIllustration.scss';

export default function NoFilesIllustration() {
  return (
    <div className="no-files-illustration">
      <img className="no-files-illustration__img" src={NoFilesImage} alt="No files" />
      <div className="no-files-illustration__text">
        <Typography color="text.primary">There are no files in this folder.</Typography>
        <Typography color="text.primary">
          Drag and drop to add files to this folder.
        </Typography>
      </div>
    </div>
  );
}
