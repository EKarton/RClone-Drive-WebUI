import { JobStatus } from 'utils/constants';
import { render } from 'test-utils/react';
import RenameFolderJobDescription from '../RenameFolderJobDescription';

describe('RenameFolderJobDescription', () => {
  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given status is %s',
    (status) => {
      const { baseElement } = render(
        <RenameFolderJobDescription
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
