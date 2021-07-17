import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs"
import { GameDataSource, MessageDataSource } from "./datasources";
import { Game } from "./generated/graphql";
import { resolvers } from "./resolvers";

const messages: Array<string> = [];
const games: Map<string, Game> = new Map<string, Game>();

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: readFileSync('../api/schema.graphql').toString('utf-8'),
  resolvers: resolvers,
  dataSources: () => {
    return {
      messageDataSource: new MessageDataSource(messages),
      gameDataSource: new GameDataSource(games)
    }
  },
  context: ({ req }) => {
    // Get the user token from the headers.
    const authHeader = req.headers.authorization;
    // console.log(req.headers);
    if (authHeader) {
      return {
        isAuthenticated: true,
      };
    } else {
      return { isAuthenticated: false };
    }

    // Try to retrieve a user with the token
    // const user = getUser(token);

    // Add the user to the context
    // return { user };
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
