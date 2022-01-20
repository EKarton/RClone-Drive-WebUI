import { render } from 'test-utils/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it.each([
    [9, 10],
    [0, 0],
    [0, 10],
    [19, 0],
  ])(
    'should match snapshot given numSuccess is %s and numOngoing is %s',
    (numSuccessful, numOngoing) => {
      const { baseElement } = render(
        <ProgressBar numSuccessful={numSuccessful} numOngoing={numOngoing} />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );
});
