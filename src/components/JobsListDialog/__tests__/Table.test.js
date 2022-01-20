import times from 'lodash/times';
import { BehaviorSubject } from 'rxjs';
import { JobStatus, JobTypes } from 'utils/constants';
import { render, screen, userEvent } from 'test-utils/react';
import Table from '../Table';

const mockJobs = Array.from({ length: 100 }, (_, i) => ({
  jobId: i,
  jobType: JobTypes.UPLOAD_FILE,
  status: new BehaviorSubject(JobStatus.ONGOING),
  cancelJob: jest.fn(),
  remote: 'gdrive',
  dirPath: 'Documents',
  name: `Dog ${i}.png`,
}));

describe('Table', () => {
  it('should match snapshot given a list of jobs', async () => {
    const { baseElement } = render(<Table jobs={mockJobs} />);

    await waitForRecordsToExist(times(10));
    expect(baseElement).toMatchSnapshot();
  });

  it('should go to the next page given user clicks on the next page button', async () => {
    render(<Table jobs={mockJobs} />);

    userEvent.click(screen.getByTestId('KeyboardArrowRightIcon'));

    await waitForRecordsToExist(times(10).map((i) => i + 10));
  });

  it('should display 25 records when user changes view to show 25 rows per page', async () => {
    render(<Table jobs={mockJobs} />);

    userEvent.click(screen.getByText('10'));
    userEvent.click(screen.getByText('25'));

    await waitForRecordsToExist(times(25));
  });

  const waitForRecordsToExist = async (nums) => {
    const pendingChecks = nums.map(async (i) => {
      await screen.findByTestId(`job-id-${i}`);
    });

    await Promise.all(pendingChecks);
  };
});
