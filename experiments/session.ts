//@ts-nocheck
import { Model } from './db';
import { User } from './user';

export class Session extends Model {
  user(): User {
    return this.belongsTo(User);
  }
}
