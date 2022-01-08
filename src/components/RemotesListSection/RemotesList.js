import InfoCard from 'components/RemoteCards/InfoCard';
import RemoteCardsList from 'components/RemoteCardsList';

export default function RemotesList({ remotes, onRemoteCardClicked }) {
  const handleClick = (remote) => () => {
    onRemoteCardClicked(remote);
  };

  return (
    <RemoteCardsList>
      {remotes.sort().map((remote) => (
        <InfoCard key={remote} remote={remote} onClick={handleClick(remote)} />
      ))}
    </RemoteCardsList>
  );
}
