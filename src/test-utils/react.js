import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ColorModeProvider } from 'contexts/ColorMode/index';
import { JobQueueProvider } from 'contexts/JobQueue/index';
import { JobsListDialogProvider } from 'contexts/JobsListDialog/index';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';
import { SnackbarProvider } from '../../node_modules/notistack/dist/index';

const customRender = (
  component,
  { initialRCloneInfoState, initialRecentPicturesState, initialJobQueueState } = {},
  { route = '/' } = {}
) => {
  const history = createMemoryHistory({ initialEntries: [route] });

  const renderedComponent = render(
    <Router location={history.location} navigator={history}>
      <RCloneInfoProvider defaultState={initialRCloneInfoState}>
        <RecentPicturesProvider defaultState={initialRecentPicturesState}>
          <ColorModeProvider>
            <JobQueueProvider defaultState={initialJobQueueState}>
              <JobsListDialogProvider>
                <SnackbarProvider
                  maxSnack={3}
                  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                  autoHideDuration={3000}
                >
                  {component}
                </SnackbarProvider>
              </JobsListDialogProvider>
            </JobQueueProvider>
          </ColorModeProvider>
        </RecentPicturesProvider>
      </RCloneInfoProvider>
    </Router>
  );

  return {
    ...renderedComponent,
    history,
  };
};

export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { customRender, userEvent, render };
