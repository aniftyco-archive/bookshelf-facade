//@ts-nocheck
import { Model } from './db';
import { User } from './user';

export class Session extends Model {
  static boot() {
    this.on('fetched', (model: BookshelfModel) => {
      console.log('fetched data', model.serialize());
    });
  }

  user(): User {
    return this.belongsTo(User);
  }
}
