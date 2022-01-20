import { JobStatus } from 'utils/constants';
import { render } from 'test-utils/react';
import RenameFileJobDescription from '../RenameFileJobDescription';

describe('RenameFileJobDescription', () => {
  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given status is %s',
    (status) => {
      const { baseElement } = render(
        <RenameFileJobDescription
          status={status}
          job={{
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
});
