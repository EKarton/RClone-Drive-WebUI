import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ColorModeProvider } from 'contexts/ColorMode/index';
import { JobQueueProvider } from 'contexts/JobQueue/index';
import { JobsListDialogProvider } from 'contexts/JobsListDialog/index';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';
import { SnackbarProvider } from 'notistack';

const customRender = (
  component,
  { initialRCloneInfoState, initialRecentPicturesState, initialJobQueueState } = {},
  { route = '/' } = {}
) => {
  const renderedComponent = render(
    <MemoryRouter initialEntries={[route]}>
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
    </MemoryRouter>
  );

  return {
    ...renderedComponent,
  };
};

export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { customRender, userEvent, render };
