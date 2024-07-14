import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from "react-error-boundary";
import App from './App'
import errorImg from './assets/error_frog.png';
//import './index.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type throwAwayType = { error: any, resetErrorBoundary: any}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Fallback({ error, resetErrorBoundary }: throwAwayType) {
  return (
    <div style={{backgroundColor: "#AFE1AF", 
                 width: '100vw', 
                 height: '100vh'}}>
      <img src={errorImg}></img>
    </div>
  );
}

// const root = document.getElementById('root');
// if (root) {
//   ReactDOM.createRoot(root).render(
//     <React.StrictMode>
//       <Router>
//         <ErrorBoundary FallbackComponent={Fallback}>
//           <App />
//         </ErrorBoundary>
//       </Router>
//     </React.StrictMode>,
//   )
// } else {
//   ReactDOM.render(
//     <div>haha</div>
//   )
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
      <Router>
        <ErrorBoundary FallbackComponent={Fallback}>
          <App />
        </ErrorBoundary>
      </Router>
    </React.StrictMode>,
);
