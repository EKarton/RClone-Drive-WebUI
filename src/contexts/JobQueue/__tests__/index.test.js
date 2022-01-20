import { useContext } from 'react';
import { JobStatus } from 'utils/constants';
import { render, userEvent, screen } from 'test-utils/react';
import { ActionTypes } from '../actionTypes';
import { JobQueueContext, JobQueueProvider } from '../index';

describe('JobQueueProvider', () => {
  it('should render initial state given mock component renders state', () => {
    const MockComponent = () => {
      const { state } = useContext(JobQueueContext);

      return <div>{JSON.stringify(state)}</div>;
    };

    const { baseElement } = render(
      <JobQueueProvider>
        <MockComponent />
      </JobQueueProvider>
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should update state given mock component dispatches event', async () => {
    const MockComponent = () => {
      const { state, dispatch } = useContext(JobQueueContext);

      const handleClick = () => {
        dispatch({ type: ActionTypes.ADD_JOB, payload: { jobId: '123' } });
        dispatch({ type: ActionTypes.ADD_STATUS_COUNT, payload: JobStatus.ONGOING });
      };

      return (
        <>
          <div>{JSON.stringify(state)}</div>
          <div>Num jobs: {state.jobs.length}</div>
          <button onClick={handleClick}>Update state</button>
        </>
      );
    };

    const { baseElement } = render(
      <JobQueueProvider>
        <MockComponent />
      </JobQueueProvider>
    );

    userEvent.click(screen.getByText('Update state'));

    await screen.findByText('Num jobs: 1');
    expect(baseElement).toMatchSnapshot();
  });
});
