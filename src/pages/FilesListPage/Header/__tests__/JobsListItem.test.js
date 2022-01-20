import { BehaviorSubject } from 'rxjs';
import { JobStatus, JobTypes } from 'utils/constants';
import { render } from 'test-utils/react';
import JobsListItem from '../JobsListItem';

describe('JobsListItem', () => {
  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given job type is UPLOAD_FILE and current status is %s',
    (status) => {
      const { baseElement } = render(
        <JobsListItem
          job={{
            status: new BehaviorSubject(status),
            jobType: JobTypes.UPLOAD_FILE,
            remote: 'gdrive',
            dirPath: 'Documents',
            name: 'Dog.png',
          }}
        />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );

  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given job type is MOVE_FILE and current status is %s',
    (status) => {
      const { baseElement } = render(
        <JobsListItem
          job={{
            status: new BehaviorSubject(status),
            jobType: JobTypes.MOVE_FILE,
            src: {
              remote: 'gdrive',
              dirPath: 'Documents',
              name: 'Dog.png',
            },
            target: {
              remote: 'box',
              dirPath: 'Archives',
              name: 'Dog.png',
            },
          }}
        />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );

  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given job type is RENAME_FILE and current status is %s',
    (status) => {
      const { baseElement } = render(
        <JobsListItem
          job={{
            status: new BehaviorSubject(status),
            jobType: JobTypes.RENAME_FILE,
            src: {
              remote: 'gdrive',
              dirPath: 'Documents',
              name: 'Dog.png',
            },
            target: {
              remote: 'box',
              dirPath: 'Archives',
              name: 'Dog.png',
            },
          }}
        />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );

  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given unknown job type and current status is %s',
    (status) => {
      const { baseElement } = render(
        <JobsListItem
          job={{
            status: new BehaviorSubject(status),
            jobType: 'Random job type',
          }}
        />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );
});
