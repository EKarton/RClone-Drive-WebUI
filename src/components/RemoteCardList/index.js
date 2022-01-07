import PropTypes from 'prop-types';
import RemoteCard from 'components/RemoteCard';
import './index.scss';

export default function RemoteCardList({ remotes, onClick }) {
  const handleClick = (remote) => () => {
    onClick(remote);
  };

  return (
    <div className="remote-card-list">
      {remotes.sort().map((remote) => (
        <RemoteCard
          key={remote}
          className="remote-card-list__item"
          remote={remote}
          onClick={handleClick(remote)}
        />
      ))}
    </div>
  );
}

RemoteCardList.propTypes = {
  remotes: PropTypes.arrayOf(RemoteCard.propTypes.remote),
  onClick: PropTypes.func,
};
