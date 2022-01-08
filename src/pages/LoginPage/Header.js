import DarkModeToggleSwitch from 'components/DarkModeToggleSwitch';
import './Header.scss';

export default function Header() {
  return (
    <div className="login-page-header">
      <DarkModeToggleSwitch />
    </div>
  );
}
