import { Breadcrumbs, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const Header = ({ remote, path }) => {
  const folders = path.split("/");
  const pastFolders = folders.slice(0, folders.length - 1);
  const curFolder = folders[folders.length - 1];

  const pastFolderPaths = useMemo(() => {
    const pastFolderPaths = [];
    let prevPath = null;

    for (const folder of pastFolders) {
      const curLink = prevPath
        ? `${prevPath}/${folder}`
        : `${remote}:${folder}`;

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
      <Link to="/files">My Files</Link>
      <Link to={Buffer.from(`${remote}:`).toString("base64")}>{remote}</Link>
      {pastFolders.map((folder, i) => (
        <Link to={Buffer.from(pastFolderPaths[i]).toString("base64")}>
          {folder}
        </Link>
      ))}
      <Typography color="text.primary">{curFolder}</Typography>
    </Breadcrumbs>
  );
};

export default Header;
