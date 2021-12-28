import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import IntroScreenImage from 'assets/images/landing-page/files-list-page.png';
import AppBar from './AppBar';
import './IntroSection.scss';

const IntroSection = () => {
  return (
    <div className="intro-section">
      <div className="intro-section__left-panel">
        <Container>
          <Typography variant="h3" className="intro-section__title">
            <strong>RClone Drive</strong>
          </Typography>
          <Typography variant="h5" className="intro-section__subtitle">
            A RClone client to view and manage your cloud files on the web.
          </Typography>
          <Button variant="contained" component={Link} to={'/login'}>
            Login
          </Button>
        </Container>
      </div>
      <div>
        <img src={IntroScreenImage} className="intro-section__image" />
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <>
      <CssBaseline />
      <AppBar />
      <Toolbar />
      <IntroSection />
    </>
  );
};

export default LandingPage;
