import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import MainApp from 'apps/MainApp';
import { ColorModeProvider } from 'contexts/ColorMode/index';
import { FileUploadCountsProvider } from 'contexts/FileUploadCounts/index';
import { JobQueueProvider } from 'contexts/JobQueue/index';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';
import AppErrorBoundary from 'pages/ErrorBoundaries/AppErrorBoundary';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppErrorBoundary>
        <RCloneInfoProvider>
          <RecentPicturesProvider>
            <ColorModeProvider>
              <JobQueueProvider>
                <SnackbarProvider maxSnack={3}>
                  <FileUploadCountsProvider>
                    <MainApp />
                  </FileUploadCountsProvider>
                </SnackbarProvider>
              </JobQueueProvider>
            </ColorModeProvider>
          </RecentPicturesProvider>
        </RCloneInfoProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
