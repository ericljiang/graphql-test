import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

/**
 * https://stackoverflow.com/a/66662717/6497736
 */
const ApolloProviderWithAuth0: React.FunctionComponent<{}> = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0(); // bad, this only runs once, maybe this can work if we force refresh?
  console.log("creating links");
  console.log("authenticated: " + isAuthenticated);
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
  });

  const authLink = setContext(async (_, { headers, ...rest }) => {
    console.log("executing auth link");
    if (isAuthenticated) { // don't bother if not logged in
      try {
        console.log("trying to get token");
        const token = await getAccessTokenSilently({ignoreCache: false});
        return {
          ...rest,
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        };
      } catch (error) {
        console.log(error);
        // loginWithRedirect();
        // getAccessTokenWithPopup();
      }
    }

    return { headers, ...rest };
  });

  const apolloClient = React.useRef<ApolloClient<NormalizedCacheObject>>();

  if (!apolloClient.current) {
    apolloClient.current = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }

  return (
    <ApolloProvider client={apolloClient.current}>
      {children}
    </ApolloProvider>
  );
};

export { ApolloProviderWithAuth0 };
