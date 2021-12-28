import Box from '@mui/material/Box';
import { Routes, Route } from 'react-router-dom';
import FilesListPageErrorBoundary from 'pages/ErrorBoundaries/FilesListPageErrorBoundary';
import PicturesListPageErrorBoundary from 'pages/ErrorBoundaries/PicturesListPageErrorBoundary';
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
  return (
    <Box className="main-app" sx={{ bgcolor: 'background.default' }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="files" element={<AppShell />}>
          <Route index element={<FilesPage />} />
          <Route
            index
            path=":id"
            element={
              <FilesListPageErrorBoundary>
                <FilesListPage />
              </FilesListPageErrorBoundary>
            }
          />
        </Route>
        <Route path="pictures" element={<AppShell />}>
          <Route index element={<PicturesPage />} />
          <Route
            index
            path=":id"
            element={
              <PicturesListPageErrorBoundary>
                <PicturesListPage />
              </PicturesListPageErrorBoundary>
            }
          />
        </Route>
        <Route path="/logout" element={<LogoutPage />} />
        <Route
          path="*"
          element={
            <NotFoundErrorPage
              error={new Error('Unknown path')}
              redirectLink="/"
              redirectText="Go back to home"
            />
          }
        />
      </Routes>
    </Box>
  );
}
