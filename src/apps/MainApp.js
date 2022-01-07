import Box from '@mui/material/Box';
import { Routes, Route } from 'react-router-dom';
import NotFoundErrorPage from 'pages/ErrorPages/NotFoundErrorPage';
import FilesListPage from 'pages/FilesListPage/index';
import FilesPage from 'pages/FilesPage/index';
import LandingPage from 'pages/LandingPage';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import PicturesListPage from 'pages/PicturesListPage/index';
import PicturesPage from 'pages/PicturesPage/index';
import AppShell from './AppShell';
import './MainApp.scss';

export default function MainApp() {
  const global404Page = (
    <NotFoundErrorPage
      error={new Error('Unknown page')}
      redirectLink="/"
      redirectText="Go back to home"
    />
  );

  return (
    <Box className="main-app" sx={{ bgcolor: 'background.default' }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="files" element={<AppShell />}>
          <Route index element={<FilesPage />} />
          <Route path=":id" element={<FilesListPage />} />
        </Route>
        <Route path="pictures" element={<AppShell />}>
          <Route index element={<PicturesPage />} />
          <Route path=":id" element={<PicturesListPage />} />
        </Route>
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" element={global404Page} />
      </Routes>
    </Box>
  );
}
