import React from 'react';
import { gql, useQuery } from '@apollo/client';
import GameList from './GameList';
import CreateGame from './CreateGame';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  const { loading, error, data } = useQuery(gql`{
    hello(name:"eric")
  }`);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div className="App">
      <p>{data.hello}</p>
      <GameList />
    </div>
  );
}

export default App;
