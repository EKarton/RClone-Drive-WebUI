import { useContext } from 'react';
import { JobQueueContext } from '../../contexts/JobQueue/index';

export default function useJobQueueInfo() {
  const { state } = useContext(JobQueueContext);
  return state;
}
