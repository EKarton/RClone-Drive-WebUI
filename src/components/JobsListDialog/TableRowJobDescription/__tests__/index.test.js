import { JobStatus, JobTypes } from 'utils/constants';
import { render } from 'test-utils/react';
import TableRowDescription from '../index';

describe('TableRowJobDescription', () => {
  it.each([
    JobTypes.MOVE_FILE,
    JobTypes.MOVE_FOLDER,
    JobTypes.RENAME_FILE,
    JobTypes.RENAME_FOLDER,
    JobTypes.UPLOAD_FILE,
    'Random job',
  ])('should contain expected string given job type is %s', (jobType) => {
    const { baseElement } = render(
      <TableRowDescription
        status={JobStatus.ONGOING}
        job={{
          jobType,
          src: {},
          target: {},
          remote: '',
          dirPath: '',
          name: '',
        }}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
