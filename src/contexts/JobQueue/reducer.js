import { JobStatus } from 'utils/constants';
import { ActionTypes } from './actionTypes';

export function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_JOBS: {
      return { ...state, jobs: action.payload };
    }
    case ActionTypes.ADD_JOB: {
      const newJobs = [action.payload, ...state.jobs];

      return { ...state, jobs: newJobs };
    }
    case ActionTypes.ADD_JOBS: {
      const newJobs = [...action.payload, ...state.jobs];

      return { ...state, jobs: newJobs };
    }
    case ActionTypes.REMOVE_JOB: {
      const newJobs = state.jobs.filter((job) => job.jobId !== action.payload);

      return { ...state, jobs: newJobs };
    }
    case ActionTypes.ADD_STATUS_COUNT: {
      return incrementValue(state, action.payload, 1);
    }
    case ActionTypes.UPDATE_STATUS: {
      const [prevStatus, curStatus] = action.payload;

      const state1 = incrementValue(state, prevStatus, -1);
      const state2 = incrementValue(state1, curStatus, 1);

      return state2;
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}

function incrementValue(state, status, amount) {
  const statusToCountField = {
    [JobStatus.ONGOING]: 'numOngoing',
    [JobStatus.SUCCESS]: 'numSuccessful',
    [JobStatus.ERROR]: 'numFailed',
  };

  if (!statusToCountField[status]) {
    throw new Error(`Unknown job status ${status}`);
  }

  const oldValue = state.statusCounts[statusToCountField[status]];

  return {
    ...state,
    statusCounts: {
      ...state.statusCounts,
      [statusToCountField[status]]: checkAmount(oldValue + amount),
    },
  };
}

function checkAmount(amount) {
  if (amount < 0) {
    throw new Error('Amount is less than 0');
  }

  return amount;
}
