import Box from '@mui/material/Box';
import { useState } from 'react';
import { Route, Switch } from 'react-router';
import GlobalAppBar from 'components/GlobalAppBar';
import GlobalNavBar from 'components/GlobalNavBar';
import FilesListPage from 'pages/FilesListPage';
import FilesPage from 'pages/FilesPage';
import PicturesListPage from 'pages/PicturesListPage';
import PicturesPage from 'pages/PicturesPage';
import './AuthenticatedApp.scss';

export default function AuthenticatedApp() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDrawerButtonClicked = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="app-shell">
      <GlobalAppBar onDrawerButttonClicked={handleDrawerButtonClicked} />
      <div className="app-shell__below-appbar">
        <GlobalNavBar isExpanded={isExpanded} />
        <Box className="app-shell__contents" sx={{ bgcolor: 'background.default' }}>
          <Switch>
            <Route path="/files" exact>
              <FilesPage />
            </Route>
            <Route path="/files/:id">
              <FilesListPage />
            </Route>
            <Route path="/pictures" exact>
              <PicturesPage />
            </Route>
            <Route path="/pictures/:id">
              <PicturesListPage />
            </Route>
          </Switch>
        </Box>
      </div>
    </div>
  );
}
