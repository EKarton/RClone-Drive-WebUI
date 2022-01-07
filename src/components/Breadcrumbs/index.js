import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { hashRemotePath } from 'utils/remote-paths-url';

export default function Breadcrumbs({ remote, path, homePath, homeText, ...props }) {
  const folders = path.split('/');
  const pastFolderNames = folders.slice(0, folders.length - 1);
  const curFolderName = folders[folders.length - 1];

  const pastFolderPaths = useMemo(() => {
    const pastFolderPaths = [];
    let prevPath = null;

    for (const folder of pastFolderNames) {
      const curLink = prevPath ? `${prevPath}/${folder}` : `${remote}:${folder}`;

      pastFolderPaths.push(`${homePath}/${hashRemotePath(curLink)}`);
      prevPath = curLink;
    }

    return pastFolderPaths;
  }, [homePath, pastFolderNames, remote]);

  const remoteLinkPath = `${homePath}/${hashRemotePath(`${remote}:`)}`;

  return (
    <MuiBreadcrumbs
      maxItems={4}
      itemsBeforeCollapse={2}
      itemsAfterCollapse={2}
      aria-label="breadcrumb"
      {...props}
    >
      <Link color="inherit" to={homePath} component={RouterLink}>
        {homeText}
      </Link>
      <Link color="inherit" to={remoteLinkPath} component={RouterLink}>
        {remote}
      </Link>
      {pastFolderPaths.map((path, i) => (
        <Link key={i} color="inherit" to={path} component={RouterLink}>
          {pastFolderNames[i]}
        </Link>
      ))}
      {curFolderName && <Typography color="text.primary">{curFolderName}</Typography>}
    </MuiBreadcrumbs>
  );
}

Breadcrumbs.propTypes = {
  remote: PropTypes.string,
  path: PropTypes.string,
  homePath: PropTypes.string,
  homeText: PropTypes.string,
};
