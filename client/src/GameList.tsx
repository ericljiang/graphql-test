import { gql, useQuery } from "@apollo/client";
import CreateGame from "./CreateGame";

export default function GameList() {
  const { loading, error, data, refetch } = useQuery(gql`
    {
      games {
        id
        ownerId
        name
      }
    }`,
    { pollInterval: 5000 });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
      <ol>
        {data.games.map((game: any) =>
          <li key={game.id}>
            "{game.name}" created by {game.ownerId} ({game.id})
          </li>)}
      </ol>
      <CreateGame refetchGames={refetch} />
    </>
  );
}
