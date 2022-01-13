import { createContext, useContext, useReducer } from 'react';

export const InitialState = {
  jobs: [],
};

export const JobQueueContext = createContext(InitialState);

export const JobQueueProvider = ({ children, defaultState = InitialState }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <JobQueueContext.Provider value={{ state, dispatch }}>
      {children}
    </JobQueueContext.Provider>
  );
};

export const ActionTypes = Object.freeze({
  ADD_JOB: 'ADD_JOB',
  REMOVE_JOB: 'REMOVE_JOB',
});

export const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_JOB: {
      const newJobs = [...state.jobs, action.payload];

      return { ...state, jobs: newJobs };
    }
    case ActionTypes.REMOVE_JOB: {
      const newJobs = state.jobs.filter((job) => job.jobId !== action.payload);

      return { ...state, jobs: newJobs };
    }

    default:
      throw new Error(`Unknown action ${action.type}`);
  }
};

export const useJobQueue = () => {
  const { state, dispatch } = useContext(JobQueueContext);

  const addJob = (jobId, jobType, args) => {
    dispatch({ type: ActionTypes.ADD_JOB, payload: { jobId, jobType, args } });
  };

  const removeJob = (jobId) => {
    dispatch({ type: ActionTypes.REMOVE_JOB, payload: jobId });
  };

  return {
    jobs: state.jobs,
    addJob,
    removeJob,
  };
};
