import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import { ApolloProviderWithAuth0 } from './ApolloProviderWithAuth0';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

ReactDOM.render(
  <Auth0Provider
    domain="dev-bwycovfn.us.auth0.com"
    clientId="5bNPWgEydGyYojJBDkWozOV6nH5qflsw"
    redirectUri={window.location.origin}
    audience="https://localhost:4000"
  >
    <ApolloProvider client={client}>
    {/* <ApolloProviderWithAuth0> */}
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ApolloProvider>
    {/* </ApolloProviderWithAuth0> */}
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
