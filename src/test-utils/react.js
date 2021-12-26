import { FileViewerProvider } from 'contexts/FileViewerDialog';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

const customRender = (
  component,
  { initialFileViewerState, initialRCloneInfoState, initialRecentPicturesState } = {},
  { route = '/' } = {}
) => {
  const history = createMemoryHistory({ initialEntries: [route] });

  const renderedComponent = render(
    <RCloneInfoProvider defaultState={initialRCloneInfoState}>
      <FileViewerProvider defaultState={initialFileViewerState}>
        <RecentPicturesProvider defaultState={initialRecentPicturesState}>
          <Router history={history}>{component}</Router>
        </RecentPicturesProvider>
      </FileViewerProvider>
    </RCloneInfoProvider>
  );

  return {
    ...renderedComponent,
    history,
  };
};

export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { customRender, userEvent, render };
