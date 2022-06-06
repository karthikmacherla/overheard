import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  ChakraProvider
} from '@chakra-ui/react'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import LoginTest from './pages/LoginTest';
import Playground from './pages/Playground';
import Profile from './pages/Profile';
import QuotePage from './pages/QuotePage';
import { GoogleOAuthProvider } from '@react-oauth/google';


// Create a client
const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
    },
  },
});

ReactDOM.render(
  <ChakraProvider>
    <GoogleOAuthProvider clientId={google_client_id}>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <div>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={<App />}
                />
                <Route
                  path="/login"
                  element={<LoginTest />}
                />
                <Route
                  path='/playground'
                  element={<Playground />}
                />
                <Route
                  path='/profile'
                  element={<Profile />}
                />
                <Route path='/quote/:id' element={<QuotePage />} />
              </Routes>
            </Router>
          </div>
        </QueryClientProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </ChakraProvider>,
  document.getElementById('root')
);


// ReactDOM.render(
//   <script src="https://apis.google.com/js/platform.js" async defer></script>,
//   document.getElementById('head')
// )
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
