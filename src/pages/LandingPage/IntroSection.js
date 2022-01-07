import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import IntroSectionImage from 'assets/images/landing-page/files-list-page.png';
import './IntroSection.scss';

export default function IntroSection() {
  return (
    <div className="intro-section">
      <div className="intro-section__left-panel">
        <Typography variant="h3" className="intro-section__title">
          <strong>RClone Drive</strong>
        </Typography>
        <Typography variant="h5" className="intro-section__subtitle">
          A RClone client to view and manage your cloud files on the web.
        </Typography>
        <Button variant="contained" component={Link} to={'/login'}>
          Login
        </Button>
      </div>
      <img src={IntroSectionImage} alt="Intro section" className="intro-section__image" />
    </div>
  );
}
