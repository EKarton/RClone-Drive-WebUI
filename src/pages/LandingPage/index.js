import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import DarkModeImage from 'assets/images/landing-page/dark-mode.png';
import FileUploadDialogImage from 'assets/images/landing-page/file-upload-dialog.png';
import ActionsImage from 'assets/images/landing-page/move-file-modal.png';
import FileViewerImage from 'assets/images/landing-page/pdf-viewer.png';
import PicturesListPageImage from 'assets/images/landing-page/pictures-list-page.png';
import AppBar from './AppBar';
import FeatureSection from './FeatureSection';
import HighlightsSection from './HighlightsSection';
import IntroSection from './IntroSection';

const LandingPage = () => {
  return (
    <>
      <CssBaseline />
      <AppBar />
      <Toolbar />
      <IntroSection />
      <HighlightsSection />
      <FeatureSection
        variant="right"
        title="View all pictures"
        subtitle="View and scroll through all of your pictures"
        imgSrc={PicturesListPageImage}
      />
      <FeatureSection
        variant="left"
        title="Open and download files"
        subtitle="View, open, and download PDFs, images, and text documents"
        imgSrc={FileViewerImage}
      />
      <FeatureSection
        variant="right"
        title="Upload new files and folders"
        subtitle="Drag-and-drop to upload files and folder to different cloud drives"
        imgSrc={FileUploadDialogImage}
      />
      <FeatureSection
        variant="left"
        title="Manage files on different cloud drives"
        subtitle="Click to copy, rename, delete, and move files between different cloud drives"
        imgSrc={ActionsImage}
      />
      <FeatureSection
        variant="right"
        title="Dark mode"
        subtitle="Ease your eyes with dark theme"
        imgSrc={DarkModeImage}
      />
    </>
  );
};

export default LandingPage;
