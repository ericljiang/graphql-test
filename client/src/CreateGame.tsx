import { ApolloQueryResult, gql, OperationVariables, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

type CreateGameProps = {
  refetchGames: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>
}

export default function CreateGame({ refetchGames }: CreateGameProps) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  async function getToken() {
    return await getAccessTokenSilently();
  }
  // const token = getToken();
  let input: any;
  const [createGame, { data }] = useMutation(gql`
    mutation CreateGame($name: String!) {
      createGame(name: $name) {
        id
      }
    }
  `);

  // useEffect(() => {
  //   async function getToken() {
  //     return await getAccessTokenSilently();
  //   }
  //   const token = getToken();
  // });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const token = getToken();
        createGame({
          variables: {
            name: input.value
          },
          context: {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        });
        input.value = ''
        refetchGames();
      }}>
      <input
        ref={node => {
          input = node;
        }}
      />
      <button type="submit">Create game</button>
    </form>
  );
}
