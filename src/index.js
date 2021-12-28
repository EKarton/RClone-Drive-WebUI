import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import MainApp from 'apps/MainApp';
import { ColorModeProvider } from 'contexts/ColorMode/index';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';
import AppErrorBoundary from 'pages/ErrorBoundaries/AppErrorBoundary';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <RCloneInfoProvider>
        <RecentPicturesProvider>
          <BrowserRouter>
            <ColorModeProvider>
              <MainApp />
            </ColorModeProvider>
          </BrowserRouter>
        </RecentPicturesProvider>
      </RCloneInfoProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
