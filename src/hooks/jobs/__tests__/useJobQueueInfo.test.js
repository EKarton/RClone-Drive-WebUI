import { JobQueueProvider } from 'contexts/JobQueue/index';
import { render } from 'test-utils/react';
import useJobQueueInfo from '../useJobQueueInfo';

describe('useJobQueueInfo()', () => {
  it('should return the correct info given it is wrapped in <JobQueueProvider>', () => {
    const MockPage = () => {
      const { jobs, statusCounts } = useJobQueueInfo();

      return (
        <>
          <div>{JSON.stringify(jobs)}</div>
          <div>{JSON.stringify(statusCounts)}</div>
        </>
      );
    };

    const { baseElement } = render(
      <JobQueueProvider>
        <MockPage />
      </JobQueueProvider>
    );

    expect(baseElement).toMatchSnapshot();
  });
});
