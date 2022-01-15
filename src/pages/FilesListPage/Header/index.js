import Breadcrumbs from 'components/Breadcrumbs';
import JobsSection from './JobsSection';
import './index.scss';

export default function Header({ remote, path }) {
  return (
    <div className="header">
      <Breadcrumbs remote={remote} path={path} homeText="My Files" homePath="/files" />
      <JobsSection />
    </div>
  );
}
