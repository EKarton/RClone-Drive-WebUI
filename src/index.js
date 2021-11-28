import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainApp from './apps/MainApp';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { RCloneInfoStateProvider } from 'contexts/RCloneInfoStore';
import { FileViewerProvider } from 'contexts/FileViewerStore';
import { RecentPicturesProvider } from 'contexts/RecentPictures';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <React.StrictMode>
    <RCloneInfoStateProvider>
      <FileViewerProvider>
        <RecentPicturesProvider>
          <BrowserRouter>
            <MainApp />
          </BrowserRouter>
        </RecentPicturesProvider>
      </FileViewerProvider>
    </RCloneInfoStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
