//@ts-nocheck
import { Model, BookshelfModel } from './db';
import { Session } from './session';

export class User extends Model {
  public static hidden = ['password'];

  static boot() {
    this.on('fetched', (model: BookshelfModel) => {
      console.log('fetched data', model.serialize());
    });
  }

  getFirstNameAttribute() {
    return this.attributes.name.replace(/^(.+)\s(.+)$/, '$1');
  }

  setNameAttribute(value: string) {
    return value;
  }

  sessions() {
    return this.hasMany(Session);
  }
}
