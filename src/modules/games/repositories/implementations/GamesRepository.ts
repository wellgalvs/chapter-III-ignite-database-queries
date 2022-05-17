import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where(
        "LOWER(games.title) ILIKE :title",
        { title: `%${param}%` }
      ).getMany();
    // query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(
      "SELECT COUNT(id) as count FROM games"
    ) as [{ count: string }]; // raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("games")
      .relation(Game, "users")
      .of(id)
      .loadMany();
    // query builder
  }
}
