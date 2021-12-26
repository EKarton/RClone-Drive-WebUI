import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainApp from './apps/MainApp';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { FileViewerProvider } from 'contexts/FileViewerDialog';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <React.StrictMode>
    <RCloneInfoProvider>
      <FileViewerProvider>
        <RecentPicturesProvider>
          <BrowserRouter>
            <MainApp />
          </BrowserRouter>
        </RecentPicturesProvider>
      </FileViewerProvider>
    </RCloneInfoProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
