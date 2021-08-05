import { ApolloServer, AuthenticationError } from "apollo-server";
import { readFileSync } from "fs"
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { GameDataSource, MessageDataSource } from "./datasources";
import { Game } from "./generated/graphql";
import { resolvers } from "./resolvers";

const messages: Array<string> = [];
const games: Map<string, Game> = new Map<string, Game>();

const clientId = "224119011410-5hbr37e370ieevfk9t64v9799kivttan.apps.googleusercontent.com"
const client = new OAuth2Client(clientId);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: readFileSync('../api/schema.graphql').toString('utf-8'),
  resolvers: resolvers,
  dataSources: () => {
    return {
      messageDataSource: new MessageDataSource(messages),
      gameDataSource: new GameDataSource(games)
    };
  },
  context: async ({ req }) => {
    // Get the user token from the headers.
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader != "") {
      const token = authHeader.split(' ')[1];
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: clientId
        });
        const payload = ticket.getPayload() as TokenPayload;
        return {
          isAuthenticated: true,
          userId: payload.sub
        };
      } catch (error) {
        // if token is invalid, throw error for all requests, even if auth not required
        throw new AuthenticationError("Invalid auth headers: " + error.message);
      }
    }

    return { isAuthenticated: false };
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
