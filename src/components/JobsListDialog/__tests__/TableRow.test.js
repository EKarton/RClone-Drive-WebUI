import { BehaviorSubject } from 'rxjs';
import { JobStatus, JobTypes } from 'utils/constants';
import { render, screen, userEvent } from 'test-utils/react';
import TableRow from '../TableRow';

describe('TableRow', () => {
  const createJob = () => ({
    jobType: JobTypes.UPLOAD_FILE,
    status: new BehaviorSubject(JobStatus.ONGOING),
    cancelJob: jest.fn(),
    remote: 'gdrive',
    dirPath: 'Documents',
    name: 'dog.png',
  });

  it('should match snapshot given sample job', () => {
    const { baseElement } = render(<TableRow job={createJob()} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should update the job status when the job status changes', async () => {
    const job = createJob();
    render(<TableRow job={job} />);

    await screen.findByText('ONGOING');

    job.status.next(JobStatus.SUCCESS);

    await screen.findByText('SUCCESS');
  });

  it('should call cancelJob when user clicks on the cancel job button', () => {
    const job = createJob();
    render(<TableRow job={job} />);

    userEvent.click(screen.getByTestId('cancel-job-button'));

    expect(job.cancelJob).toBeCalled();
  });
});
