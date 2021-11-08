import { FileViewerProvider, initialState } from 'contexts/FileViewerStore';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

const customRender = (
  component,
  { initialFileViewerState = initialState } = {},
  { route = '/' } = {}
) => {
  const history = createMemoryHistory({ initialEntries: [route] });

  return render(
    <FileViewerProvider defaultState={initialFileViewerState}>
      <Router history={history}>{component}</Router>
    </FileViewerProvider>
  );
};

export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { customRender, userEvent };
