import { render } from 'test-utils/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it.each([
    [9, 10],
    [0, 0],
    [0, 10],
  ])(
    'should match snapshot given numSuccess is %s and numUploading is %s',
    (numSuccessful, numUploading) => {
      const { baseElement } = render(
        <ProgressBar numSuccessful={numSuccessful} numUploading={numUploading} />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );
});
