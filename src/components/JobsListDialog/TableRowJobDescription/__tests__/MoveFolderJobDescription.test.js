import { JobStatus } from 'utils/constants';
import { render } from 'test-utils/react';
import MoveFolderJobDescription from '../MoveFolderJobDescription';

describe('MoveFolderJobDescription', () => {
  it.each([JobStatus.ONGOING, JobStatus.SUCCESS, JobStatus.ERROR])(
    'should match snapshot given status is %s',
    (status) => {
      const { baseElement } = render(
        <MoveFolderJobDescription
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
