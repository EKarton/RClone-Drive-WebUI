import InfoIcon from '@mui/icons-material/Info';
import MouseIcon from '@mui/icons-material/Mouse';
import SecurityIcon from '@mui/icons-material/Security';
import Typography from '@mui/material/Typography';
import './HighlightsSection.scss';

export default function HighlightsSection() {
  return (
    <div className="highlights-section">
      <div className="highlights-section__column">
        <div className="highlights-section__header">
          <InfoIcon color="primary" fontSize="large" />
          <Typography variant="h4">
            <strong>About</strong>
          </Typography>
        </div>
        <Typography variant="h6">
          This is a front-facing web application that connects to your RClone instance.
          You can securely view and manage your files across many cloud providers through
          this web app.
        </Typography>
      </div>
      <div className="highlights-section__column">
        <div className="highlights-section__header">
          <SecurityIcon color="warning" fontSize="large" />
          <Typography variant="h4">
            <strong>Secure</strong>
          </Typography>
        </div>
        <Typography variant="h6">
          All actions are done locally on your computer. Nothing is done in our backend
          servers.
        </Typography>
      </div>
      <div className="highlights-section__column">
        <div className="highlights-section__header">
          <MouseIcon color="success" fontSize="large" />
          <Typography variant="h4">
            <strong>Easy to use</strong>
          </Typography>
        </div>
        <Typography variant="h6">
          Drag-and-drop to upload files, right-click and select to delete, move, or copy
          files between different cloud providers.
        </Typography>
      </div>
    </div>
  );
}
