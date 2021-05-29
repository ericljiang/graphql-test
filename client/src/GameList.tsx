import { gql, useQuery } from "@apollo/client";
import CreateGame from "./CreateGame";

export default function GameList() {
  const { loading, error, data, refetch } = useQuery(gql`{
    games {
      id
      name
    }
  }`, {
    pollInterval: 5000
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
      <ol>
        {data.games.map((game: any) => <li>{game.name} ({game.id})</li>)}
      </ol>
      <CreateGame refetchGames={refetch} />
    </>
  );
}
