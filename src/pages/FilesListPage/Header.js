import { Link } from 'react-router-dom';
import Breadcrumbs from 'components/Breadcrumbs';

export default function Header({ remote, path }) {
  return (
    <div>
      <Breadcrumbs
        remote={remote}
        path={path}
        homeLink={<Link to="/files">My Files</Link>}
      />
      <div></div>
    </div>
  );
}
