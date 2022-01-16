import { render } from 'test-utils/react';
import JobsButton from '../JobsButton';

describe('JobsButton', () => {
  it.each([
    [0, 0, 0],
    [10, 0, 0],
    [9, 1, 0],
    [8, 1, 1],
    [0, 9, 1],
    [0, 10, 0],
    [0, 0, 10],
  ])(
    'should match snapshot given numOngoing = %s, numSuccessful = %s, numFailed = %s',
    (numOngoing, numSuccessful, numFailed) => {
      const { baseElement } = render(
        <JobsButton
          statusCounts={{
            numOngoing,
            numSuccessful,
            numFailed,
          }}
        />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );
});
