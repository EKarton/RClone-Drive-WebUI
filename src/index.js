import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { RecentPicturesProvider } from 'contexts/RecentPicturesList';
import MainApp from './apps/MainApp';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <RCloneInfoProvider>
      <RecentPicturesProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </RecentPicturesProvider>
    </RCloneInfoProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
