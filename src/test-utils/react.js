import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ColorModeProvider } from 'contexts/ColorMode/index';
import { FileUploadCountsProvider } from 'contexts/FileUploadCounts/index';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';

const customRender = (
  component,
  { initialRCloneInfoState, initialRecentPicturesState } = {},
  { route = '/' } = {}
) => {
  const history = createMemoryHistory({ initialEntries: [route] });

  const renderedComponent = render(
    <RCloneInfoProvider defaultState={initialRCloneInfoState}>
      <RecentPicturesProvider defaultState={initialRecentPicturesState}>
        <Router location={history.location} navigator={history}>
          <ColorModeProvider>
            <FileUploadCountsProvider>{component}</FileUploadCountsProvider>
          </ColorModeProvider>
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
