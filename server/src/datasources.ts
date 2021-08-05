import { DataSource } from 'apollo-datasource'
import { Game } from './generated/graphql';
import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';

export class MessageDataSource extends DataSource {
  private readonly messages: Array<string>;
  constructor(messages: Array<string>) {
    super();
    this.messages = messages;
  }
  getMessages() {
    return this.messages;
  }
  pushMessage(message: string) {
    this.messages.push(message);
  }
}

export class GameDataSource extends DataSource {
  private readonly games: Map<string, Game>;
  constructor(games: Map<string, Game>) {
    super();
    this.games = games;
  }
  getGames() {
    return Array.from(this.games.values());
  }
  getGame(id: string) {
    return this.games.get(id);
  }

  createGame(name: string, ownerId: string) {
    const nanoid = customAlphabet(alphanumeric, 12);
    const id = nanoid();
    const game: Game = {
      id: id,
      ownerId: ownerId,
      name: name,
      players: []
    };
    this.games.set(id, game);
    return game;
  }
}
