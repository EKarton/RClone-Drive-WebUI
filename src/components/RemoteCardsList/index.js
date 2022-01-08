import PropTypes from 'prop-types';
import './index.scss';

export default function RemoteCardsList({ children }) {
  return <div className="remote-card-list">{children}</div>;
}

RemoteCardsList.propTypes = {
  children: PropTypes.node,
};
