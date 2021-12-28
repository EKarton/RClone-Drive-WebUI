import Box from '@mui/material/Box';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GlobalAppBar from 'components/GlobalAppBar';
import GlobalNavBar from 'components/GlobalNavBar';
import './AppShell.scss';

export default function AppShell() {
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
          <Outlet />
        </Box>
      </div>
    </div>
  );
}
