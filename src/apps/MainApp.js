import { Routes, Route } from 'react-router-dom';
import FilesListPageErrorBoundary from 'pages/ErrorBoundaries/FilesListPageErrorBoundary';
import PicturesListPageErrorBoundary from 'pages/ErrorBoundaries/PicturesListPageErrorBoundary';
import FilesListPage from 'pages/FilesListPage/index';
import FilesPage from 'pages/FilesPage/index';
import LandingPage from 'pages/LandingPage';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import PicturesListPage from 'pages/PicturesListPage/index';
import PicturesPage from 'pages/PicturesPage/index';
import AppShell from './AppShell';

export default function MainApp() {
  return (
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
    </Routes>
  );
}
