import SkeletonCard from 'components/RemoteCards/SkeletonCard';
import RemoteCardsList from 'components/RemoteCardsList';

export default function RemotesListSkeleton() {
  return (
    <RemoteCardsList>
      {Array.from({ length: 4 }, () => (
        <SkeletonCard />
      ))}
    </RemoteCardsList>
  );
}
