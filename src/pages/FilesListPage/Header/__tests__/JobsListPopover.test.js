import { times } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { JobStatus, JobTypes } from 'utils/constants';
import { render, screen } from 'test-utils/react';
import JobsListPopover from '../JobsListPopover';

describe('JobsListPopover', () => {
  it('should display the last 4 jobs given more than 4 jobs', async () => {
    const jobs = times(10).map((i) => ({
      status: new BehaviorSubject(JobStatus.ONGOING),
      jobType: JobTypes.UPLOAD_FILE,
      remote: 'gdrive',
      dirPath: 'Documents',
      name: `Job ${i}.png`,
    }));

    render(
      <JobsListPopover
        open
        jobs={jobs}
        anchorEl={null}
        onClose={jest.fn()}
        onMoreClicked={jest.fn()}
      />
    );

    for (let i = 0; i < 6; i++) {
      expect(screen.queryByText(`Uploading Job ${i}.png`)).not.toBeInTheDocument();
    }

    for (let i = 6; i < 10; i++) {
      await screen.findByText(`Uploading Job ${i}.png`);
    }
  });

  it('should display all jobs given there are less than 4 jobs', async () => {
    const jobs = times(3).map((i) => ({
      status: new BehaviorSubject(JobStatus.ONGOING),
      jobType: JobTypes.UPLOAD_FILE,
      remote: 'gdrive',
      dirPath: 'Documents',
      name: `Job ${i}.png`,
    }));

    render(
      <JobsListPopover
        open
        jobs={jobs}
        anchorEl={null}
        onClose={jest.fn()}
        onMoreClicked={jest.fn()}
      />
    );

    for (let i = 0; i < 3; i++) {
      await screen.findByText(`Uploading Job ${i}.png`);
    }
  });
});
