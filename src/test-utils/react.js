import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { ColorModeProvider } from 'contexts/ColorMode/index';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';
import AppErrorBoundary from 'pages/ErrorBoundaries/AppErrorBoundary';

const customRender = (
  component,
  { initialRCloneInfoState, initialRecentPicturesState } = {},
  { route = '/' } = {}
) => {
  const history = createMemoryHistory({ initialEntries: [route] });

  const renderedComponent = render(
    <RCloneInfoProvider defaultState={initialRCloneInfoState}>
      <RecentPicturesProvider defaultState={initialRecentPicturesState}>
        <Router history={history}>
          <ColorModeProvider>{component}</ColorModeProvider>
        </Router>
      </RecentPicturesProvider>
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
