import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { hashRemotePath } from 'utils/remote-paths-url';

export default function Header({ remote, path, homeLink }) {
  const folders = path.split('/');
  const pastFolders = folders.slice(0, folders.length - 1);
  const curFolder = folders[folders.length - 1];

  const pastFolderPaths = useMemo(() => {
    const pastFolderPaths = [];
    let prevPath = null;

    for (const folder of pastFolders) {
      const curLink = prevPath ? `${prevPath}/${folder}` : `${remote}:${folder}`;

      pastFolderPaths.push(curLink);
      prevPath = curLink;
    }

    return pastFolderPaths;
  }, [pastFolders, remote]);

  return (
    <Breadcrumbs
      maxItems={4}
      itemsBeforeCollapse={2}
      itemsAfterCollapse={2}
      aria-label="breadcrumb"
    >
      {homeLink}
      <Link to={hashRemotePath(`${remote}:`)}>{remote}</Link>
      {pastFolders.map((folder, i) => (
        <Link key={i} to={hashRemotePath(pastFolderPaths[i])}>
          {folder}
        </Link>
      ))}
      <Typography color="text.primary">{curFolder}</Typography>
    </Breadcrumbs>
  );
}
