import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs"
import { resolvers } from "./resolvers";

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: readFileSync('../api/schema.graphql').toString('utf-8'),
  resolvers: resolvers
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
