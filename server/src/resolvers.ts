import { Resolvers } from './generated/graphql';

export const resolvers: Resolvers = {
  Query: {
    hello: (_, args) => `Hello, ${args.name}`
  }
}
