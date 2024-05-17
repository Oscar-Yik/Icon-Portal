import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from "react-error-boundary";
import App from './App.jsx'
import errorImg from './assets/error_frog.png';
//import './index.css'

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div style={{backgroundColor: "#AFE1AF", 
                 width: '100vw', 
                 height: '100vh'}}>
      <img src={errorImg}></img>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ErrorBoundary FallbackComponent={Fallback}>
        <App />
      </ErrorBoundary>
    </Router>
  </React.StrictMode>,
)
