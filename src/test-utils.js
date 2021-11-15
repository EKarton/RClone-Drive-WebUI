import { RCloneInfoStateProvider } from 'contexts/RCloneInfoStore';
import { initialState as initialState1 } from 'contexts/RCloneInfoStore';
import { FileViewerProvider } from 'contexts/FileViewerStore';
import { initialState as initialState2 } from 'contexts/FileViewerStore';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

const customRender = (
  component,
  { initialFileViewerState = initialState1, initialRCloneInfoState = initialState2 } = {},
  { route = '/' } = {}
) => {
  const history = createMemoryHistory({ initialEntries: [route] });

  const renderedComponent = render(
    <RCloneInfoStateProvider defaultState={initialRCloneInfoState}>
      <FileViewerProvider defaultState={initialFileViewerState}>
        <Router history={history}>{component}</Router>
      </FileViewerProvider>
    </RCloneInfoStateProvider>
  );

  return {
    ...renderedComponent,
    history,
  };
};

export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { customRender, userEvent };