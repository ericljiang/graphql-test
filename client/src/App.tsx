import React from 'react';
import { gql, useQuery } from '@apollo/client';
import GameList from './GameList';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import {GoogleLoginResponse, useGoogleLogin, useGoogleLogout } from 'react-google-login';

function App() {
  // TODO move auth to separate component
  const googleClientId = "224119011410-5hbr37e370ieevfk9t64v9799kivttan.apps.googleusercontent.com";
  const tokenStorageKey = "token";
  const tokenExpiryStorageKey = "tokenExpiry";

  // TODO provide reference to functions through context api
  function storeToken(token: string, tokenExpiry: number): void {
    // TODO context api to store token
    localStorage.setItem(tokenStorageKey, token);
    localStorage.setItem(tokenExpiryStorageKey, tokenExpiry.toString());
    console.debug("Stored token");
  }

  function clearToken(): void {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(tokenExpiryStorageKey);
    console.debug("Token cleared");
  }

  async function reloadAuth(authResponse: GoogleLoginResponse) {
    console.debug("Reloading auth");
    try {
      const newResponse = await authResponse.reloadAuthResponse();
      storeToken(newResponse.id_token, newResponse.expires_at);
      setTimeout(() => reloadAuth(authResponse), newResponse.expires_in * 1000);
    } catch (error) {
      console.warn("Unable to refresh authentication: ", error);
      clearToken();
    }
  }

  // load hook at top-level component for auto token refresh
  const { signIn } = useGoogleLogin({
    clientId: googleClientId,
    onSuccess: response => {
      const googleLoginResponse = response as GoogleLoginResponse; // not using offline access type
      storeToken(googleLoginResponse.tokenId, googleLoginResponse.tokenObj.expires_at);
      // set up timer to refresh token
      const millisToExpiration = googleLoginResponse.tokenObj.expires_in * 1000;
      // setTimeout(signIn, millisToExpiration);
      setTimeout(() => reloadAuth(googleLoginResponse), millisToExpiration);
    },
    isSignedIn: true // auto refresh token on load
  });

  const { signOut } = useGoogleLogout({
    clientId: googleClientId,
    onLogoutSuccess: clearToken
  });

  const { loading, error, data } = useQuery(gql`{
    hello(name:"eric")
  }`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error connecting to server :(<br/>{JSON.stringify(error)}</p>;

  return (
    <div className="App">
      <LoginButton onClick={signIn}/>
      <LogoutButton onClick={signOut}/>
      <p>{data.hello}</p>
      <GameList />
    </div>
  );
}

export default App;
