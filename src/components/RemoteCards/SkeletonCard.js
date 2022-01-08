import Skeleton from '@mui/material/Skeleton';
import BaseCard from './BaseCard';

export default function SkeletonCard() {
  return (
    <BaseCard
      remoteName={<Skeleton />}
      remoteType={<Skeleton />}
      remoteSpace={<Skeleton />}
    />
  );
}

SkeletonCard.propTypes = {};
