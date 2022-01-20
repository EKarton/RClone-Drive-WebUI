import { BehaviorSubject } from 'rxjs';
import { JobStatus } from 'utils/constants';
import { ActionTypes } from '../actionTypes';
import { InitialState } from '../index';
import { reducer } from '../reducer';

describe('given action type is SET_JOBS', () => {
  it('should set the list of jobs to a new list of jobs', () => {
    const newJobs = [
      {
        jobId: '2',
        status: new BehaviorSubject(JobStatus.ONGOING),
      },
      {
        jobId: '1',
        status: new BehaviorSubject(JobStatus.ONGOING),
      },
    ];

    const newState = reducer(InitialState, {
      type: ActionTypes.SET_JOBS,
      payload: newJobs,
    });

    expect(newState.jobs).toEqual(newJobs);
  });
});

describe('given action type is ADD_JOB', () => {
  it('should add a new job to the end of the jobs list', () => {
    const newJob = {
      jobId: '3',
      status: new BehaviorSubject(JobStatus.ONGOING),
    };

    const mockInitialState = {
      ...InitialState,
      jobs: [
        {
          jobId: '2',
          status: new BehaviorSubject(JobStatus.ONGOING),
        },
        {
          jobId: '1',
          status: new BehaviorSubject(JobStatus.ONGOING),
        },
      ],
    };

    const newState = reducer(mockInitialState, {
      type: ActionTypes.ADD_JOB,
      payload: newJob,
    });

    expect(newState.jobs).toEqual([newJob, ...mockInitialState.jobs]);
  });
});

describe('given action type is ADD_JOBS', () => {
  it('should add a list of new jobs to the end of the jobs list', () => {
    const newJobs = [
      {
        jobId: '4',
        status: new BehaviorSubject(JobStatus.ONGOING),
      },
      {
        jobId: '3',
        status: new BehaviorSubject(JobStatus.ONGOING),
      },
    ];

    const mockInitialState = {
      ...InitialState,
      jobs: [
        {
          jobId: '2',
          status: new BehaviorSubject(JobStatus.ONGOING),
        },
        {
          jobId: '1',
          status: new BehaviorSubject(JobStatus.ONGOING),
        },
      ],
    };

    const newState = reducer(mockInitialState, {
      type: ActionTypes.ADD_JOBS,
      payload: newJobs,
    });

    expect(newState.jobs).toEqual([...newJobs, ...mockInitialState.jobs]);
  });
});

describe('given action type is REMOVE_JOB', () => {
  it('should remove the job given the job ID exists', () => {
    const mockInitialState = {
      ...InitialState,
      jobs: [
        {
          jobId: '2',
          status: new BehaviorSubject(JobStatus.ONGOING),
        },
        {
          jobId: '1',
          status: new BehaviorSubject(JobStatus.ONGOING),
        },
      ],
    };

    const newState = reducer(mockInitialState, {
      type: ActionTypes.REMOVE_JOB,
      payload: '2',
    });

    expect(newState.jobs).toEqual([mockInitialState.jobs[1]]);
  });

  it('should not do anything given job ID does not exist', () => {
    const mockInitialState = {
      ...InitialState,
      jobs: [
        {
          jobId: '2',
          status: new BehaviorSubject(JobStatus.ONGOING),
        },
        {
          jobId: '1',
          status: new BehaviorSubject(JobStatus.ONGOING),
        },
      ],
    };

    const newState = reducer(mockInitialState, {
      type: ActionTypes.REMOVE_JOB,
      payload: '3',
    });

    expect(newState.jobs).toEqual(mockInitialState.jobs);
  });
});

describe('given action type is ADD_STATUS_COUNT', () => {
  it('should add the correct status count by one given job status is ongoing', () => {
    const newState = reducer(InitialState, {
      type: ActionTypes.ADD_STATUS_COUNT,
      payload: JobStatus.ONGOING,
    });

    expect(newState.statusCounts).toEqual({
      numOngoing: 1,
      numSuccessful: 0,
      numFailed: 0,
    });
  });

  it('should add the correct status count by one given job status is success', () => {
    const newState = reducer(InitialState, {
      type: ActionTypes.ADD_STATUS_COUNT,
      payload: JobStatus.SUCCESS,
    });

    expect(newState.statusCounts).toEqual({
      numOngoing: 0,
      numSuccessful: 1,
      numFailed: 0,
    });
  });

  it('should add the correct status count by one given job status is error', () => {
    const newState = reducer(InitialState, {
      type: ActionTypes.ADD_STATUS_COUNT,
      payload: JobStatus.ERROR,
    });

    expect(newState.statusCounts).toEqual({
      numOngoing: 0,
      numSuccessful: 0,
      numFailed: 1,
    });
  });

  it('should throw an error given unknown job status', () => {
    const getNewState = () => {
      return reducer(InitialState, {
        type: ActionTypes.ADD_STATUS_COUNT,
        payload: 'Random job status',
      });
    };

    expect(getNewState).toThrowError();
  });
});

describe('given action type is UPDATE_STATUS', () => {
  it('should decrement the previous job status count and increment the new job status count', () => {
    const mockInitialState = {
      ...InitialState,
      statusCounts: {
        numOngoing: 1,
        numSuccessful: 0,
        numFailed: 0,
      },
    };

    const newState = reducer(mockInitialState, {
      type: ActionTypes.UPDATE_STATUS,
      payload: [JobStatus.ONGOING, JobStatus.SUCCESS],
    });

    expect(newState.statusCounts).toEqual({
      numOngoing: 0,
      numSuccessful: 1,
      numFailed: 0,
    });
  });

  it('should throw an error given previous job status count is 0', () => {
    const getNewState = () => {
      return reducer(InitialState, {
        type: ActionTypes.UPDATE_STATUS,
        payload: [JobStatus.ONGOING, JobStatus.SUCCESS],
      });
    };

    expect(getNewState).toThrowError();
  });
});

describe('given unknown action type', () => {
  it('should throw an error', () => {
    const getNewState = () => {
      return reducer(InitialState, {
        type: 'Random action',
        payload: {},
      });
    };

    expect(getNewState).toThrowError();
  });
});
