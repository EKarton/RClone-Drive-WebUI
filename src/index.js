import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainApp from "./apps/MainApp";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { StateProvider } from "store/RCloneInfoStore";
import "semantic-ui-css/semantic.min.css";
import { FileViewerProvider } from "store/FileViewerStore";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider>
      <FileViewerProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </FileViewerProvider>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
