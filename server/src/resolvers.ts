import { Game, Resolvers, SubscriptionGameUpdatedArgs } from './generated/graphql';
import { GameDataSource, MessageDataSource } from './datasources';
import {AuthenticationError, PubSub, UserInputError, withFilter } from 'apollo-server';

export const pubsub = new PubSub();

export const resolvers: Resolvers = {
  Query: {
    hello: (_root, args) => `Hello, ${args.name}`,
    messages: (_root, _args, { dataSources }) => {
      return (dataSources.messageDataSource as MessageDataSource).getMessages();
    },
    games: (_root, _args, { dataSources }) => {
      return (dataSources.gameDataSource as GameDataSource).getGames();
    }
  },
  Mutation: {
    message: (_root, args, { dataSources }) => {
      (dataSources.messageDataSource as MessageDataSource).pushMessage(args.message);
      return args.message
    },
    createGame: (_root, args, { dataSources, isAuthenticated, userId }) => {
      if (!isAuthenticated || !userId) {
        throw new AuthenticationError("Not authenticated.");
      }
      const gameDataSource = dataSources.gameDataSource as GameDataSource;
      const game = gameDataSource.createGame(args.name, userId);
      pubsub.publish("GAME_CREATED", {
        gameCreated: game
      });
      return game;
    },
    joinGame: (_root, args, { dataSources }) => {
      const gameDataSource = dataSources.gameDataSource as GameDataSource;
      const game = gameDataSource.getGame(args.gameId)
      if (game) {
        game.players?.push(args.playerId);
        pubsub.publish("GAME_UPDATED", { gameUpdated: game });
        return game;
      } else {
        throw new UserInputError(`No game found with ID ${args.gameId}.`);
      }
    }
  },
  Subscription: {
    gameCreated: {
      subscribe: () => pubsub.asyncIterator("GAME_CREATED")
    },
    gameUpdated: {
      // TODO secret redaction
      resolve: (payload: { gameUpdated: Game }) => payload.gameUpdated,
      subscribe: withFilter(
        () => pubsub.asyncIterator("GAME_UPDATED"),
        (payload: { gameUpdated: Game }, variables: SubscriptionGameUpdatedArgs) =>
          payload.gameUpdated.id === variables.id
      )
    }
  }
}
