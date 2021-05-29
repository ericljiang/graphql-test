import { ApolloQueryResult, gql, OperationVariables, useMutation } from "@apollo/client";

type CreateGameProps = {
  refetchGames: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>
}

export default function CreateGame({ refetchGames }: CreateGameProps) {
  let input: any;
  const [createGame, { data }] = useMutation(gql`
  mutation CreateGame($name: String!) {
    createGame(name: $name) {
      id
    }
  }`);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        createGame({ variables: { name: input.value } });
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
