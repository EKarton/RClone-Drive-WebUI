import { JobStatus } from 'utils/constants';

export default function GenericJobDescription({ status }) {
  if (status === JobStatus.ERROR) {
    return <span>Job failed</span>;
  }

  if (status === JobStatus.SUCCESS) {
    return <span>Job succeeded</span>;
  }

  return <span>Job ongoing</span>;
}
