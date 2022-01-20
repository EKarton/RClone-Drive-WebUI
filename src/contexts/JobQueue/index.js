import { createContext, useReducer } from 'react';
import { reducer } from './reducer';

export const InitialState = {
  jobs: [],
  statusCounts: {
    numOngoing: 0,
    numSuccessful: 0,
    numFailed: 0,
  },
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

export * from './actionTypes';
